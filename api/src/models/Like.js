import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";

const isAdmin = (actor) => actor?.role === "admin";

const targetSpec = (target) => {
  if (target === "post") return { foreignKey: "post_id" };
  if (target === "comment") return { foreignKey: "comment_id" };
  throw new AppError(
    400,
    ERROR_CODES.VALIDATION_ERROR,
    "Invalid reaction target",
  );
};

const targetRows = async (connection, target, id, lock = false) => {
  if (target === "post") {
    const [rows] = await connection.query(
      `SELECT id,author_id,status FROM posts WHERE id = ?${lock ? " FOR UPDATE" : ""}`,
      [id],
    );
    return rows;
  }
  const [rows] = await connection.query(
    `SELECT c.id,c.author_id,c.status,p.status AS post_status FROM comments c JOIN posts p ON p.id = c.post_id WHERE c.id = ?${lock ? " FOR UPDATE" : ""}`,
    [id],
  );
  return rows;
};

const targetVisible = (row, target, actor) =>
  row &&
  (isAdmin(actor) ||
    (row.status === "active" &&
      (target === "post" || row.post_status === "active")));

export class Like {
  constructor(db) {
    this.db = db;
  }

  static async lockUsers(connection) {
    await connection.query("SELECT id FROM users ORDER BY id FOR UPDATE");
  }

  static async recalculate(connection) {
    await connection.query(
      "UPDATE users u SET rating = COALESCE((SELECT SUM(CASE WHEN l.type = 'like' THEN 1 ELSE -1 END) FROM likes l LEFT JOIN posts p ON p.id = l.post_id LEFT JOIN comments c ON c.id = l.comment_id WHERE p.author_id = u.id OR c.author_id = u.id), 0)",
    );
  }

  async list(target, id, viewer) {
    const spec = targetSpec(target);
    const targets = await targetRows(this.db, target, id);
    if (!targetVisible(targets[0], target, viewer))
      throw new AppError(
        404,
        ERROR_CODES.TARGET_NOT_FOUND,
        "Reaction target not found",
      );
    const [rows] = await this.db.query(
      `SELECT l.id,l.author_id,l.type,l.created_at FROM likes l WHERE l.${spec.foreignKey} = ? ORDER BY l.created_at, l.id`,
      [id],
    );
    return rows;
  }

  async listAll(viewer) {
    if (!isAdmin(viewer))
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Admin access required");
    const [rows] = await this.db.query(
      "SELECT id,author_id,post_id,comment_id,type,created_at FROM likes ORDER BY created_at DESC,id DESC",
    );
    return rows;
  }

  async get(id, viewer) {
    if (!isAdmin(viewer))
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Admin access required");
    const [rows] = await this.db.query(
      "SELECT id,author_id,post_id,comment_id,type,created_at FROM likes WHERE id = ?",
      [id],
    );
    if (!rows[0])
      throw new AppError(
        404,
        ERROR_CODES.REACTION_NOT_FOUND,
        "Reaction not found",
      );
    return rows[0];
  }

  async create(target, id, type, actor) {
    const spec = targetSpec(target);
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const targets = await targetRows(connection, target, id, true);
      if (!targetVisible(targets[0], target, actor))
        throw new AppError(
          404,
          ERROR_CODES.TARGET_NOT_FOUND,
          "Reaction target not found",
        );
      let result;
      try {
        [result] = await connection.query(
          `INSERT INTO likes (author_id,${spec.foreignKey},type) VALUES (?,?,?)`,
          [actor.id, id, type],
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY")
          throw new AppError(
            409,
            ERROR_CODES.REACTION_EXISTS,
            "Reaction already exists",
          );
        throw error;
      }
      await Like.recalculate(connection);
      const [rows] = await connection.query(
        "SELECT id,author_id,post_id,comment_id,type,created_at FROM likes WHERE id = ?",
        [result.insertId],
      );
      return rows[0];
    });
  }

  async delete(target, id, actor, authorId) {
    const spec = targetSpec(target);
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    const selectedAuthorId =
      isAdmin(actor) && authorId !== undefined ? authorId : actor.id;
    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const targets = await targetRows(connection, target, id, true);
      if (!targetVisible(targets[0], target, actor))
        throw new AppError(
          404,
          ERROR_CODES.TARGET_NOT_FOUND,
          "Reaction target not found",
        );
      const [rows] = await connection.query(
        `SELECT id,author_id FROM likes WHERE ${spec.foreignKey} = ? AND author_id = ? FOR UPDATE`,
        [id, selectedAuthorId],
      );
      if (!rows[0])
        throw new AppError(
          404,
          ERROR_CODES.REACTION_NOT_FOUND,
          "Reaction not found",
        );
      await connection.query("DELETE FROM likes WHERE id = ?", [rows[0].id]);
      await Like.recalculate(connection);
      return { id: Number(rows[0].id) };
    });
  }
}
