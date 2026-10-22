import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { Like } from "./Like.js";
import { DATE_ONLY_PATTERN } from "../constants/regex.js";

const isAdmin = (actor) => actor?.role === "admin";
const visible = (post, viewer) =>
  post &&
  (post.status === "active" ||
    isAdmin(viewer) ||
    Number(post.author_id) === Number(viewer?.id));
const integerIds = (values) => [
  ...new Set(
    (Array.isArray(values) ? values : [])
      .map(Number)
      .filter(Number.isInteger)
      .filter((value) => value > 0),
  ),
];

const options = (query) => ({
  page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  pageSize: Math.min(
    100,
    Math.max(1, Number.parseInt(query.page_size, 10) || 20),
  ),
  sort: query.sort === "date" ? "date" : "likes",
  direction: query.direction === "asc" ? "ASC" : "DESC",
  authorId: query.author_id ? Number.parseInt(query.author_id, 10) : null,
  search: query.search?.trim() || null,
  summary: query.summary === true,
  categories: integerIds(query.categories),
  dateFrom: DATE_ONLY_PATTERN.test(query.date_from || "")
    ? query.date_from
    : null,
  dateTo: DATE_ONLY_PATTERN.test(query.date_to || "") ? query.date_to : null,
  status: ["active", "inactive"].includes(query.status) ? query.status : null,
});

const fullPostFields =
  "p.id,p.author_id,p.title,p.content,p.status,p.publish_date,p.updated_at";
const summaryPostFields =
  "p.id,p.author_id,p.title,p.status,p.publish_date,p.updated_at";
const attachSummaries = async (connection, posts) => {
  if (!posts.length) {
    return posts;
  }

  const postIds = [...new Set(posts.map((post) => Number(post.id)))];
  const placeholders = postIds.map(() => "?").join(",");
  const authorIds = [...new Set(posts.map((post) => Number(post.author_id)))];
  const authorPlaceholders = authorIds.map(() => "?").join(",");
  const [authors] = await connection.query(
    `SELECT id,login,full_name,role,profile_picture,rating,created_at FROM users WHERE id IN (${authorPlaceholders})`,
    authorIds,
  );
  const authorsById = new Map(
    authors.map((author) => [Number(author.id), author]),
  );
  const [categories] = await connection.query(
    `SELECT pc.post_id,c.id,c.title,c.description,c.created_at,c.updated_at FROM post_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.post_id IN (${placeholders}) ORDER BY c.title,c.id`,
    postIds,
  );
  const [commentCounts] = await connection.query(
    `SELECT post_id,COUNT(*) AS comment_count FROM comments WHERE post_id IN (${placeholders}) AND status = 'active' AND is_deleted = FALSE GROUP BY post_id`,
    postIds,
  );
  const categoriesByPost = new Map();
  for (const category of categories) {
    const postId = Number(category.post_id);
    const postCategories = categoriesByPost.get(postId) ?? [];
    postCategories.push({
      id: Number(category.id),
      title: category.title,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at,
    });
    categoriesByPost.set(postId, postCategories);
  }
  const commentCountsByPost = new Map(
    commentCounts.map((row) => [Number(row.post_id), Number(row.comment_count)]),
  );
  return posts.map((post) => ({
    ...post,
    author: authorsById.get(Number(post.author_id)) ?? null,
    categories: categoriesByPost.get(Number(post.id)) ?? [],
    comment_count: commentCountsByPost.get(Number(post.id)) ?? 0,
  }));
};

const ensureCategories = async (connection, categories) => {
  if (!categories.length) {
    return;
  }

  const [rows] = await connection.query(
    `SELECT id FROM categories WHERE id IN (${categories.map(() => "?").join(",")})`,
    categories,
  );
  if (rows.length !== categories.length) {
    throw new AppError(
      400,
      ERROR_CODES.INVALID_CATEGORY,
      "One or more categories do not exist",
    );
  }
};

export class Post {
  constructor(db) {
    this.db = db;
  }

  async list(query = {}, viewer) {
    const queryOptions = options(query);
    const where = [];
    const values = [];
    if (!isAdmin(viewer)) {
      where.push("(p.status = 'active' OR p.author_id = ?)");
      values.push(viewer?.id || 0);
    }

    if (queryOptions.status) {
      where.push("p.status = ?");
      values.push(queryOptions.status);
    }

    if (queryOptions.authorId) {
      where.push("p.author_id = ?");
      values.push(queryOptions.authorId);
    }

    if (queryOptions.search) {
      where.push(
        "(INSTR(LOWER(p.title), LOWER(?)) > 0 OR INSTR(LOWER(p.content), LOWER(?)) > 0)",
      );
      values.push(queryOptions.search, queryOptions.search);
    }

    if (queryOptions.dateFrom) {
      where.push("p.publish_date >= ?");
      values.push(queryOptions.dateFrom);
    }

    if (queryOptions.dateTo) {
      where.push("p.publish_date < DATE_ADD(?, INTERVAL 1 DAY)");
      values.push(queryOptions.dateTo);
    }

    if (queryOptions.categories.length) {
      where.push(
        `EXISTS (SELECT 1 FROM post_categories pc WHERE pc.post_id = p.id AND pc.category_id IN (${queryOptions.categories.map(() => "?").join(",")}))`,
      );
      values.push(...queryOptions.categories);
    }

    const condition = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const order =
      queryOptions.sort === "likes"
        ? `COUNT(CASE WHEN l.type = 'like' THEN l.id END) ${queryOptions.direction}, p.publish_date DESC, p.id DESC`
        : `p.publish_date ${queryOptions.direction}, p.id DESC`;
    const offset = (queryOptions.page - 1) * queryOptions.pageSize;
    const [rows] = await this.db.query(
      `SELECT ${queryOptions.summary ? summaryPostFields : fullPostFields},COUNT(CASE WHEN l.type = 'like' THEN l.id END) AS like_count,COUNT(CASE WHEN l.type = 'dislike' THEN l.id END) AS dislike_count,COUNT(l.id) AS reaction_count FROM posts p LEFT JOIN likes l ON l.post_id = p.id ${condition} GROUP BY p.id ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...values, queryOptions.pageSize, offset],
    );
    const [counts] = await this.db.query(
      `SELECT COUNT(*) AS total FROM posts p ${condition}`,
      values,
    );
    const total = Number(counts[0].total);
    return {
      data: await attachSummaries(this.db, rows),
      meta: {
        page: queryOptions.page,
        page_size: queryOptions.pageSize,
        total,
        total_pages: Math.ceil(total / queryOptions.pageSize),
      },
    };
  }

  async listFavorites(query = {}, viewer) {
    if (!viewer) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    const queryOptions = options(query);
    const where = ["f.user_id = ?"];
    const values = [viewer.id];
    if (!isAdmin(viewer)) {
      where.push("(p.status = 'active' OR p.author_id = ?)");
      values.push(viewer.id);
    }

    const condition = `WHERE ${where.join(" AND ")}`;
    const offset = (queryOptions.page - 1) * queryOptions.pageSize;
    const [rows] = await this.db.query(
      `SELECT ${fullPostFields},f.created_at AS favorited_at,1 AS is_favorite,COUNT(CASE WHEN l.type = 'like' THEN l.id END) AS like_count,COUNT(CASE WHEN l.type = 'dislike' THEN l.id END) AS dislike_count,COUNT(l.id) AS reaction_count FROM favorites f JOIN posts p ON p.id = f.post_id LEFT JOIN likes l ON l.post_id = p.id ${condition} GROUP BY p.id,f.created_at ORDER BY f.created_at DESC,p.id DESC LIMIT ? OFFSET ?`,
      [...values, queryOptions.pageSize, offset],
    );
    const [counts] = await this.db.query(
      `SELECT COUNT(*) AS total FROM favorites f JOIN posts p ON p.id = f.post_id ${condition}`,
      values,
    );
    const total = Number(counts[0].total);
    return {
      data: await attachSummaries(this.db, rows),
      meta: {
        page: queryOptions.page,
        page_size: queryOptions.pageSize,
        total,
        total_pages: Math.ceil(total / queryOptions.pageSize),
      },
    };
  }

  async addFavorite(id, actor) {
    if (!actor) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    return transaction(this.db, async (connection) => {
      const [posts] = await connection.query(
        "SELECT id,author_id,status FROM posts WHERE id = ? FOR UPDATE",
        [id],
      );
      if (!visible(posts[0], actor)) {
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      }

      await connection.query(
        "INSERT INTO favorites (user_id,post_id) VALUES (?,?) ON DUPLICATE KEY UPDATE post_id = VALUES(post_id)",
        [actor.id, id],
      );
    });
  }

  async removeFavorite(id, actor) {
    if (!actor) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    return transaction(this.db, async (connection) => {
      await connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND post_id = ?",
        [actor.id, id],
      );
    });
  }

  async get(id, viewer) {
    const [rows] = await this.db.query(
      `SELECT ${fullPostFields},COUNT(CASE WHEN l.type = 'like' THEN l.id END) AS like_count,COUNT(CASE WHEN l.type = 'dislike' THEN l.id END) AS dislike_count,COUNT(l.id) AS reaction_count FROM posts p LEFT JOIN likes l ON l.post_id = p.id WHERE p.id = ? GROUP BY p.id`,
      [id],
    );
    if (!visible(rows[0], viewer)) {
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    }

    return (await attachSummaries(this.db, rows))[0];
  }

  async categories(id, viewer) {
    return (await this.get(id, viewer)).categories;
  }

  async create(input, actor) {
    if (!actor) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    const createdId = await transaction(this.db, async (connection) => {
      const categories = integerIds(input.categories);
      await ensureCategories(connection, categories);
      const [result] = await connection.query(
        "INSERT INTO posts (author_id,title,content,status) VALUES (?,?,?,'active')",
        [actor.id, input.title.trim(), input.content.trim()],
      );
      if (categories.length) {
        await connection.query(
          `INSERT INTO post_categories (post_id,category_id) VALUES ${categories.map(() => "(?,?)").join(",")}`,
          categories.flatMap((categoryId) => [result.insertId, categoryId]),
        );
      }

      return result.insertId;
    });
    return this.get(createdId, actor);
  }

  async update(id, input, actor) {
    if (!actor) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    const [posts] = await this.db.query(
      "SELECT id,author_id,status FROM posts WHERE id = ?",
      [id],
    );
    const post = posts[0];
    if (!visible(post, actor)) {
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    }

    if (!isAdmin(actor) && Number(post.author_id) !== Number(actor.id)) {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
    }

    const fields = [];
    const values = [];
    if (isAdmin(actor)) {
      if (input.status !== undefined) {
        fields.push("status = ?");
        values.push(input.status);
      }
    } else {
      if (input.title !== undefined) {
        fields.push("title = ?");
        values.push(input.title.trim());
      }

      if (input.content !== undefined) {
        fields.push("content = ?");
        values.push(input.content.trim());
      }
    }

    await transaction(this.db, async (connection) => {
      if (fields.length) {
        await connection.query(
          `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`,
          [...values, id],
        );
      }

      if (input.categories !== undefined) {
        const categories = integerIds(input.categories);
        await ensureCategories(connection, categories);
        await connection.query(
          "DELETE FROM post_categories WHERE post_id = ?",
          [id],
        );
        if (categories.length) {
          await connection.query(
            `INSERT INTO post_categories (post_id,category_id) VALUES ${categories.map(() => "(?,?)").join(",")}`,
            categories.flatMap((categoryId) => [id, categoryId]),
          );
        }
      }
    });
    return this.get(id, actor);
  }

  async delete(id, actor) {
    if (!actor) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    }

    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const [rows] = await connection.query(
        "SELECT id,author_id FROM posts WHERE id = ? FOR UPDATE",
        [id],
      );
      if (!rows[0]) {
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      }

      if (!isAdmin(actor) && Number(rows[0].author_id) !== Number(actor.id)) {
        throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
      }

      await connection.query("DELETE FROM posts WHERE id = ?", [id]);
      await Like.recalculate(connection);
      return { id: Number(id) };
    });
  }
}
