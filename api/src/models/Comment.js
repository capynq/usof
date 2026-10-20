import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { Like } from "./Like.js";

const isAdmin = (actor) => actor?.role === "admin";
const postVisible = (post, viewer) =>
  post &&
  (post.status === "active" ||
    isAdmin(viewer) ||
    Number(post.author_id) === Number(viewer?.id));
const commentFields =
  "c.id,c.post_id,c.author_id,c.content,c.status,c.publish_date,c.updated_at";
const privateComment = async (connection, id, lock = false) => {
  const [rows] = await connection.query(
    `SELECT ${commentFields},p.author_id AS post_author_id,p.status AS post_status FROM comments c JOIN posts p ON p.id = c.post_id WHERE c.id = ?${lock ? " FOR UPDATE" : ""}`,
    [id],
  );
  return rows[0] || null;
};

export class Comment {
  constructor(db) {
    this.db = db;
  }

  async list(viewer) {
    if (!isAdmin(viewer))
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Admin access required");
    const [rows] = await this.db.query(
      `SELECT ${commentFields} FROM comments c ORDER BY c.publish_date DESC,c.id DESC`,
    );
    return rows;
  }

  async listForPost(postId, viewer) {
    const [posts] = await this.db.query(
      "SELECT id,author_id,status FROM posts WHERE id = ?",
      [postId],
    );
    if (!postVisible(posts[0], viewer))
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    const condition = isAdmin(viewer) ? "" : " AND c.status = 'active'";
    const [rows] = await this.db.query(
      `SELECT ${commentFields} FROM comments c WHERE c.post_id = ?${condition} ORDER BY c.publish_date,c.id`,
      [postId],
    );
    return rows;
  }

  async get(id, viewer) {
    const row = await privateComment(this.db, id);
    if (
      !row ||
      !postVisible(
        { author_id: row.post_author_id, status: row.post_status },
        viewer,
      ) ||
      (!isAdmin(viewer) && row.status !== "active")
    )
      throw new AppError(
        404,
        ERROR_CODES.COMMENT_NOT_FOUND,
        "Comment not found",
      );
    delete row.post_author_id;
    delete row.post_status;
    return row;
  }

  async create(postId, input, actor) {
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    const createdId = await transaction(this.db, async (connection) => {
      const [posts] = await connection.query(
        "SELECT id,author_id,status FROM posts WHERE id = ? FOR UPDATE",
        [postId],
      );
      if (!posts[0] || (!isAdmin(actor) && posts[0].status !== "active"))
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      const [result] = await connection.query(
        "INSERT INTO comments (post_id,author_id,content,status) VALUES (?,?,?,'active')",
        [postId, actor.id, input.content.trim()],
      );
      return result.insertId;
    });
    return this.get(createdId, actor);
  }

  async update(id, input, actor) {
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    return transaction(this.db, async (connection) => {
      const comment = await privateComment(connection, id, true);
      if (!comment)
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      if (
        !postVisible(
          { author_id: comment.post_author_id, status: comment.post_status },
          actor,
        )
      )
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      if (!isAdmin(actor) && Number(comment.author_id) !== Number(actor.id))
        throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
      if (input.status !== undefined)
        await connection.query("UPDATE comments SET status = ? WHERE id = ?", [
          input.status,
          id,
        ]);
      const updated = await privateComment(connection, id);
      delete updated.post_author_id;
      delete updated.post_status;
      return updated;
    });
  }

  async delete(id, actor) {
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const comment = await privateComment(connection, id, true);
      if (!comment)
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      if (
        !postVisible(
          { author_id: comment.post_author_id, status: comment.post_status },
          actor,
        )
      )
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      if (!isAdmin(actor) && Number(comment.author_id) !== Number(actor.id))
        throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
      await connection.query("DELETE FROM comments WHERE id = ?", [id]);
      await Like.recalculate(connection);
      return { id: Number(id) };
    });
  }
}
