import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { isAdmin, requireAuthenticatedUser, requireAdmin } from "./access.js";

const targetSpec = (target) => {
  if (target === "post") return { foreignKey: "post_id" };
  if (target === "comment") return { foreignKey: "comment_id" };
  throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Invalid reaction target");
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

const targetVisible = (row, target, user) =>
  row &&
  (isAdmin(user) ||
    (row.status === "active" && (target === "post" || row.post_status === "active")));

const requireVisibleTarget = (row, target, user) => {
  if (!targetVisible(row, target, user)) {
    throw new AppError(404, ERROR_CODES.TARGET_NOT_FOUND, "Reaction target not found");
  }
};

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
    requireVisibleTarget(targets[0], target, viewer);
    const [rows] = await this.db.query(
      `SELECT l.id,l.author_id,l.type,l.created_at,u.login,u.full_name,u.profile_picture FROM likes l JOIN users u ON u.id = l.author_id WHERE l.${spec.foreignKey} = ? ORDER BY l.created_at, l.id`,
      [id],
    );

    return rows.map(({ login, full_name, profile_picture, ...reaction }) => ({
      ...reaction,
      author: {
        id: Number(reaction.author_id),
        login,
        full_name,
        profile_picture,
      },
    }));
  }

  async listAll(viewer) {
    requireAdmin(viewer);
    const [rows] = await this.db.query(
      "SELECT id,author_id,post_id,comment_id,type,created_at FROM likes ORDER BY created_at DESC,id DESC",
    );

    return rows;
  }

  async get(id, viewer) {
    requireAdmin(viewer);
    const [rows] = await this.db.query(
      "SELECT id,author_id,post_id,comment_id,type,created_at FROM likes WHERE id = ?",
      [id],
    );
    if (!rows[0]) throw new AppError(404, ERROR_CODES.REACTION_NOT_FOUND, "Reaction not found");

    return rows[0];
  }

  async create(target, id, type, user) {
    const spec = targetSpec(target);
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const targets = await targetRows(connection, target, id, true);
      requireVisibleTarget(targets[0], target, user);
      let result;

      try {
        [result] = await connection.query(
          `INSERT INTO likes (author_id,${spec.foreignKey},type) VALUES (?,?,?)`,
          [user.id, id, type],
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY")
          throw new AppError(409, ERROR_CODES.REACTION_EXISTS, "Reaction already exists");
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

  async delete(target, id, user, authorId) {
    const spec = targetSpec(target);

    requireAuthenticatedUser(user);

    const selectedAuthorId = isAdmin(user) && authorId !== undefined ? authorId : user.id;

    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);

      const targets = await targetRows(connection, target, id, true);

      requireVisibleTarget(targets[0], target, user);

      const [rows] = await connection.query(
        `SELECT id,author_id FROM likes WHERE ${spec.foreignKey} = ? AND author_id = ? FOR UPDATE`,
        [id, selectedAuthorId],
      );
      if (!rows[0]) throw new AppError(404, ERROR_CODES.REACTION_NOT_FOUND, "Reaction not found");

      await connection.query("DELETE FROM likes WHERE id = ?", [rows[0].id]);
      await Like.recalculate(connection);

      return { id: Number(rows[0].id) };
    });
  }
}
