import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { Like } from "./Like.js";
import { DATE_ONLY_PATTERN } from "../constants/regex.js";
import { isAdmin, requireAuthenticatedUser } from "./access.js";

const visible = (post, viewer) =>
  post &&
  (post.status === "active" || isAdmin(viewer) || Number(post.author_id) === Number(viewer?.id));
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
  pageSize: Math.min(100, Math.max(1, Number.parseInt(query.page_size, 10) || 20)),
  sort: query.sort === "date" ? "date" : "likes",
  direction: query.direction === "asc" ? "ASC" : "DESC",
  authorId: query.author_id ? Number.parseInt(query.author_id, 10) : null,
  search: query.search?.trim() || null,
  summary: query.summary === true,
  categories: integerIds(query.categories),
  dateFrom: DATE_ONLY_PATTERN.test(query.date_from || "") ? query.date_from : null,
  dateTo: DATE_ONLY_PATTERN.test(query.date_to || "") ? query.date_to : null,
  status: ["active", "inactive"].includes(query.status) ? query.status : null,
});

const fullPostFields = "p.id,p.author_id,p.title,p.content,p.status,p.publish_date,p.updated_at";
const summaryPostFields =
  "p.id,p.author_id,p.title,LEFT(p.content,320) AS excerpt,p.status,p.publish_date,p.updated_at";
const reactionCountFields =
  "COUNT(CASE WHEN l.type = 'like' THEN l.id END) AS like_count,COUNT(CASE WHEN l.type = 'dislike' THEN l.id END) AS dislike_count,COUNT(l.id) AS reaction_count";

const attachSummaries = async (connection, posts, viewer) => {
  if (!posts.length) {
    return posts;
  }

  const postIds = [...new Set(posts.map((post) => Number(post.id)))];
  const placeholders = postIds.map(() => "?").join(",");
  const [favorites] = await connection.query(
    `SELECT post_id FROM favorites WHERE user_id = ? AND post_id IN (${placeholders})`,
    [viewer?.id || 0, ...postIds],
  );
  const favoriteIds = new Set(favorites.map((row) => Number(row.post_id)));
  const authorIds = [...new Set(posts.map((post) => Number(post.author_id)))];
  const authorPlaceholders = authorIds.map(() => "?").join(",");
  const [authors] = await connection.query(
    `SELECT id,login,full_name,role,profile_picture,rating,created_at FROM users WHERE id IN (${authorPlaceholders})`,
    authorIds,
  );
  const authorsById = new Map(authors.map((author) => [Number(author.id), author]));
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
    is_favorite: post.is_favorite ?? favoriteIds.has(Number(post.id)),
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
    throw new AppError(400, ERROR_CODES.INVALID_CATEGORY, "One or more categories do not exist");
  }
};

const insertPostCategories = async (connection, postId, categories) => {
  if (!categories.length) {
    return;
  }

  await connection.query(
    `INSERT INTO post_categories (post_id,category_id) VALUES ${categories.map(() => "(?,?)").join(",")}`,
    categories.flatMap((categoryId) => [postId, categoryId]),
  );
};

const pageResult = async (connection, rows, page, pageSize, total, viewer) => ({
  data: await attachSummaries(connection, rows, viewer),
  meta: {
    page,
    page_size: pageSize,
    total,
    total_pages: Math.ceil(total / pageSize),
  },
});

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
      where.push("(INSTR(LOWER(p.title), LOWER(?)) > 0 OR INSTR(LOWER(p.content), LOWER(?)) > 0)");
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
      `SELECT ${queryOptions.summary ? summaryPostFields : fullPostFields},${reactionCountFields},MAX(CASE WHEN l.author_id = ? THEN l.type END) AS viewer_reaction FROM posts p LEFT JOIN likes l ON l.post_id = p.id ${condition} GROUP BY p.id ORDER BY ${order} LIMIT ? OFFSET ?`,
      [viewer?.id || 0, ...values, queryOptions.pageSize, offset],
    );
    const [counts] = await this.db.query(
      `SELECT COUNT(*) AS total FROM posts p ${condition}`,
      values,
    );

    return pageResult(
      this.db,
      rows,
      queryOptions.page,
      queryOptions.pageSize,
      Number(counts[0].total),
      viewer,
    );
  }

  async listFavorites(query = {}, viewer) {
    requireAuthenticatedUser(viewer);

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
      `SELECT ${fullPostFields},f.created_at AS favorited_at,1 AS is_favorite,${reactionCountFields},MAX(CASE WHEN l.author_id = ? THEN l.type END) AS viewer_reaction FROM favorites f JOIN posts p ON p.id = f.post_id LEFT JOIN likes l ON l.post_id = p.id ${condition} GROUP BY p.id,f.created_at ORDER BY f.created_at DESC,p.id DESC LIMIT ? OFFSET ?`,
      [viewer.id, ...values, queryOptions.pageSize, offset],
    );
    const [counts] = await this.db.query(
      `SELECT COUNT(*) AS total FROM favorites f JOIN posts p ON p.id = f.post_id ${condition}`,
      values,
    );

    return pageResult(
      this.db,
      rows,
      queryOptions.page,
      queryOptions.pageSize,
      Number(counts[0].total),
      viewer,
    );
  }

  async addFavorite(id, user) {
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      const [posts] = await connection.query(
        "SELECT id,author_id,status FROM posts WHERE id = ? FOR UPDATE",
        [id],
      );

      if (!visible(posts[0], user)) {
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      }

      await connection.query(
        "INSERT INTO favorites (user_id,post_id) VALUES (?,?) ON DUPLICATE KEY UPDATE post_id = VALUES(post_id)",
        [user.id, id],
      );
    });
  }

  async removeFavorite(id, user) {
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      await connection.query("DELETE FROM favorites WHERE user_id = ? AND post_id = ?", [
        user.id,
        id,
      ]);
    });
  }

  async get(id, viewer) {
    const [rows] = await this.db.query(
      `SELECT ${fullPostFields},COUNT(CASE WHEN l.type = 'like' THEN l.id END) AS like_count,COUNT(CASE WHEN l.type = 'dislike' THEN l.id END) AS dislike_count,COUNT(l.id) AS reaction_count,MAX(CASE WHEN l.author_id = ? THEN l.type END) AS viewer_reaction FROM posts p LEFT JOIN likes l ON l.post_id = p.id WHERE p.id = ? GROUP BY p.id`,
      [viewer?.id || 0, id],
    );

    if (!visible(rows[0], viewer)) {
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    }

    return (await attachSummaries(this.db, rows, viewer))[0];
  }

  async categories(id, viewer) {
    return (await this.get(id, viewer)).categories;
  }

  async create(input, user) {
    requireAuthenticatedUser(user);

    const createdId = await transaction(this.db, async (connection) => {
      const categories = integerIds(input.categories);
      await ensureCategories(connection, categories);
      const [result] = await connection.query(
        "INSERT INTO posts (author_id,title,content,status) VALUES (?,?,?,'active')",
        [user.id, input.title.trim(), input.content.trim()],
      );
      await insertPostCategories(connection, result.insertId, categories);

      return result.insertId;
    });

    return this.get(createdId, user);
  }

  async update(id, input, user) {
    requireAuthenticatedUser(user);

    const [posts] = await this.db.query("SELECT id,author_id,status FROM posts WHERE id = ?", [id]);
    const post = posts[0];

    if (!visible(post, user)) {
      throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
    }

    if (!isAdmin(user) && Number(post.author_id) !== Number(user.id)) {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
    }

    const isOwner = Number(post.author_id) === Number(user.id);

    if (!isOwner && (input.title !== undefined || input.content !== undefined)) {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Only the author can edit post text");
    }

    if (!isAdmin(user) && input.status !== undefined) {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Only an admin can edit post status");
    }

    const fields = [];
    const values = [];

    if (input.status !== undefined) {
      fields.push("status = ?");
      values.push(input.status);
    }

    if (input.title !== undefined) {
      fields.push("title = ?");
      values.push(input.title.trim());
    }

    if (input.content !== undefined) {
      fields.push("content = ?");
      values.push(input.content.trim());
    }

    await transaction(this.db, async (connection) => {
      if (fields.length) {
        await connection.query(`UPDATE posts SET ${fields.join(", ")} WHERE id = ?`, [
          ...values,
          id,
        ]);
      }

      if (input.categories !== undefined) {
        const categories = integerIds(input.categories);
        await ensureCategories(connection, categories);
        await connection.query("DELETE FROM post_categories WHERE post_id = ?", [id]);
        await insertPostCategories(connection, id, categories);
      }
    });

    return this.get(id, user);
  }

  async delete(id, user) {
    requireAuthenticatedUser(user);

    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const [rows] = await connection.query(
        "SELECT id,author_id FROM posts WHERE id = ? FOR UPDATE",
        [id],
      );

      if (!rows[0]) {
        throw new AppError(404, ERROR_CODES.POST_NOT_FOUND, "Post not found");
      }

      if (!isAdmin(user) && Number(rows[0].author_id) !== Number(user.id)) {
        throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
      }

      await connection.query("DELETE FROM posts WHERE id = ?", [id]);
      await Like.recalculate(connection);

      return { id: Number(id) };
    });
  }
}
