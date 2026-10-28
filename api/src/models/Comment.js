import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { isAdmin, requireAuthenticatedUser, requireAdmin } from "./access.js";
import { Like } from "./Like.js";

const postVisible = (post, viewer) =>
  post &&
  (post.status === "active" ||
    isAdmin(viewer) ||
    Number(post.author_id) === Number(viewer?.id));
const removedContent = "This comment is no longer available.";
const commentFields =
  "c.id,c.post_id,c.parent_id,c.author_id,c.content,c.status,c.is_deleted,c.publish_date,c.updated_at,u.id AS author_summary_id,u.login AS author_login,u.full_name AS author_full_name,u.role AS author_role,u.profile_picture AS author_profile_picture,u.rating AS author_rating,u.created_at AS author_created_at";
const reactionCountsJoin = `LEFT JOIN (
  SELECT comment_id,
    COUNT(CASE WHEN type = 'like' THEN 1 END) AS like_count,
    COUNT(CASE WHEN type = 'dislike' THEN 1 END) AS dislike_count,
    COUNT(*) AS reaction_count
  FROM likes
  WHERE comment_id IS NOT NULL
  GROUP BY comment_id
) reaction_counts ON reaction_counts.comment_id = c.id`;
const selectComments = ({ includePostContext = false, includeViewerReaction = false } = {}) => {
  const fields = [
    commentFields,
    includePostContext
      ? "(SELECT COUNT(*) FROM likes l WHERE l.comment_id = c.id AND l.type = 'like') AS like_count"
      : "COALESCE(reaction_counts.like_count,0) AS like_count",
    includePostContext
      ? "(SELECT COUNT(*) FROM likes l WHERE l.comment_id = c.id AND l.type = 'dislike') AS dislike_count"
      : "COALESCE(reaction_counts.dislike_count,0) AS dislike_count",
    includePostContext
      ? "(SELECT COUNT(*) FROM likes l WHERE l.comment_id = c.id) AS reaction_count"
      : "COALESCE(reaction_counts.reaction_count,0) AS reaction_count",
  ];
  if (includePostContext) {
    fields.push("p.author_id AS post_author_id", "p.status AS post_status");
  }
  if (includeViewerReaction) {
    fields.push("(SELECT l.type FROM likes l WHERE l.comment_id = c.id AND l.author_id = ? LIMIT 1) AS viewer_reaction");
  }

  const postJoin = includePostContext ? "JOIN posts p ON p.id = c.post_id" : "";
  const reactionsJoin = includePostContext ? "" : reactionCountsJoin;
  return `SELECT ${fields.join(",")} FROM comments c JOIN users u ON u.id = c.author_id ${postJoin} ${reactionsJoin}`;
};

const assertCommentAccess = (comment, user) => {
  if (!postVisible({ author_id: comment.post_author_id, status: comment.post_status }, user)) {
    throw new AppError(404, ERROR_CODES.COMMENT_NOT_FOUND, "Comment not found");
  }
  if (!isAdmin(user) && Number(comment.author_id) !== Number(user.id)) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
  }
};

const privateComment = async (connection, id, lock = false) => {
  const [rows] = await connection.query(
    `${selectComments({ includePostContext: true })} WHERE c.id = ?${lock ? " FOR UPDATE" : ""}`,
    [id],
  );
  return rows[0] || null;
};

const presentComment = (row, contextOnly = false) => {
  const {
    author_summary_id,
    author_login,
    author_full_name,
    author_role,
    author_profile_picture,
    author_rating,
    author_created_at,
    ...comment
  } = row;

  comment.author = {
    id: Number(author_summary_id),
    login: author_login,
    full_name: author_full_name,
    role: author_role,
    profile_picture: author_profile_picture,
    rating: Number(author_rating),
    created_at: author_created_at,
  };
  comment.like_count = Number(comment.like_count);
  comment.dislike_count = Number(comment.dislike_count);
  comment.reaction_count = Number(comment.reaction_count);
  comment.is_deleted = Boolean(Number(comment.is_deleted));
  comment.is_context_placeholder = contextOnly;
  if (comment.is_deleted || contextOnly) {
    comment.content = removedContent;
  }

  return comment;
};

const compareSiblings = (first, second) =>
  Number(first.like_count) - Number(second.like_count) ||
  new Date(first.publish_date).getTime() -
    new Date(second.publish_date).getTime() ||
  Number(first.id) - Number(second.id);

const orderDiscussion = (rows, viewer) => {
  const comments = rows.map((row) =>
    presentComment(
      row,
      !isAdmin(viewer) && row.status !== "active" && !Boolean(Number(row.is_deleted)),
    ),
  );

  const siblings = new Map();
  for (const comment of comments) {
    const parentId = comment.parent_id === null ? null : Number(comment.parent_id);
    const group = siblings.get(parentId) ?? [];
    group.push(comment);
    siblings.set(parentId, group);
  }

  const ordered = [];
  const visited = new Set();
  const appendChildren = (parentId) => {
    const group = siblings.get(parentId) ?? [];
    group.sort(compareSiblings);
    for (const comment of group) {
      const id = Number(comment.id);
      if (visited.has(id)) {
        continue;
      }

      visited.add(id);
      ordered.push(comment);
      appendChildren(id);
    }
  };

  appendChildren(null);

  for (const comment of comments) {
    if (!visited.has(Number(comment.id))) {
      appendChildren(Number(comment.parent_id));
    }
  }

  return ordered;
};

export class Comment {
  constructor(db) {
    this.db = db;
  }

  async list(viewer) {
    requireAdmin(viewer);

    const [rows] = await this.db.query(
      `${selectComments({ includeViewerReaction: true })} ORDER BY c.publish_date DESC,c.id DESC`,
      [viewer.id],
    );
    return rows.map((row) => presentComment(row));
  }

  async listForPost(postId, viewer) {
    const [posts] = await this.db.query(
      "SELECT id,author_id,status FROM posts WHERE id = ?",
      [postId],
    );
    if (!postVisible(posts[0], viewer)) {
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    }

    const discussionCte = isAdmin(viewer)
      ? ""
      : `WITH RECURSIVE discussion_ids (id,parent_id) AS (
          SELECT id,parent_id FROM comments
          WHERE post_id = ? AND (status = 'active' OR is_deleted = TRUE)
          UNION
          SELECT parent.id,parent.parent_id FROM comments parent
          JOIN discussion_ids child ON child.parent_id = parent.id
          WHERE parent.post_id = ?
        )`;
    const condition = isAdmin(viewer)
      ? "WHERE c.post_id = ?"
      : "WHERE c.post_id = ? AND c.id IN (SELECT id FROM discussion_ids)";
    const values = isAdmin(viewer)
      ? [viewer?.id || 0, postId]
      : [postId, postId, viewer?.id || 0, postId];
    const [rows] = await this.db.query(
      `${discussionCte} ${selectComments({ includeViewerReaction: true })} ${condition}`,
      values,
    );
    return orderDiscussion(rows, viewer);
  }

  async get(id, viewer) {
    const row = await privateComment(this.db, id);
    if (
      !row ||
      !postVisible(
        { author_id: row.post_author_id, status: row.post_status },
        viewer,
      ) ||
      (!isAdmin(viewer) &&
        row.status !== "active" &&
        !Boolean(Number(row.is_deleted)))
    ) {
      throw new AppError(
        404,
        ERROR_CODES.COMMENT_NOT_FOUND,
        "Comment not found",
      );
    }

    return presentComment(row);
  }

  async create(postId, input, user) {
    requireAuthenticatedUser(user);

    const createdId = await transaction(this.db, async (connection) => {
      const [posts] = await connection.query(
        "SELECT id,author_id,status FROM posts WHERE id = ? FOR UPDATE",
        [postId],
      );
      if (!posts[0] || (!isAdmin(user) && posts[0].status !== "active")) {
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      }

      const parentId = input.parent_id ?? null;
      if (parentId !== null) {
        const [parents] = await connection.query(
          "SELECT id,status,is_deleted FROM comments WHERE id = ? AND post_id = ? FOR UPDATE",
          [parentId, postId],
        );
        if (
          !parents[0] ||
          parents[0].status !== "active" ||
          Boolean(Number(parents[0].is_deleted))
        ) {
          throw new AppError(
            404,
            ERROR_CODES.COMMENT_NOT_FOUND,
            "Comment not found",
          );
        }
      }

      const [result] = await connection.query(
        "INSERT INTO comments (post_id,parent_id,author_id,content,status) VALUES (?,?,?,?, 'active')",
        [postId, parentId, user.id, input.content.trim()],
      );
      return result.insertId;
    });
    return this.get(createdId, user);
  }

  async update(id, input, user) {
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      const comment = await privateComment(connection, id, true);
      if (!comment) {
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      }

      if (Boolean(Number(comment.is_deleted))) {
        throw new AppError(
          409,
          ERROR_CODES.CONFLICT,
          "Removed comments cannot be modified",
        );
      }

      assertCommentAccess(comment, user);

      if (input.status !== undefined) {
        await connection.query("UPDATE comments SET status = ? WHERE id = ?", [
          input.status,
          id,
        ]);
      } else {
        if (Number(comment.author_id) !== Number(user.id)) {
          throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
        }
        await connection.query("UPDATE comments SET content = ? WHERE id = ?", [
          input.content,
          id,
        ]);
      }

      return presentComment(await privateComment(connection, id));
    });
  }

  async delete(id, user) {
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const comment = await privateComment(connection, id, true);
      if (!comment) {
        throw new AppError(
          404,
          ERROR_CODES.COMMENT_NOT_FOUND,
          "Comment not found",
        );
      }

      assertCommentAccess(comment, user);

      const [replies] = await connection.query(
        "SELECT id FROM comments WHERE parent_id = ? LIMIT 1 FOR UPDATE",
        [id],
      );
      if (replies.length) {
        await connection.query(
          "UPDATE comments SET content = '',status = 'inactive',is_deleted = TRUE WHERE id = ?",
          [id],
        );
        await connection.query("DELETE FROM likes WHERE comment_id = ?", [id]);
      } else {
        await connection.query("DELETE FROM comments WHERE id = ?", [id]);
      }
      await Like.recalculate(connection);
      return { id: Number(id) };
    });
  }
}
