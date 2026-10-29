import { transaction } from "../src/config/database.js";
import { Like } from "../src/models/Like.js";
import { hashPassword } from "../src/utils/password.js";

const seedDate = (month, index) => `2026-${month}-${String(index + 1).padStart(2, "0")}`;

export const seed = async (pool, config) => {
  await transaction(pool, async (connection) => {
    const [existing] = await connection.query("SELECT id FROM users LIMIT 1");
    if (existing.length) return;
    const seedPassword = config.seedPassword;

    if (!seedPassword) {
      throw new Error("SEED_PASSWORD is required to seed users");
    }

    if (seedPassword.length < 8 || seedPassword.length > 128 || seedPassword.includes("\0")) {
      throw new Error("SEED_PASSWORD must be 8 to 128 characters and contain no null bytes");
    }

    const users = [
      ["admin", "admin@example.test", "Admin", "admin"],
      ["test1", "test1@example.test", "Test1", "user"],
      ["test2", "test2@example.test", "Test2", "user"],
      ["test3", "test3@example.test", "Test3", "user"],
      ["test4", "test4@example.test", "Test4", "user"],
    ];

    for (let index = 0; index < users.length; index += 1) {
      const [login, email, fullName, role] = users[index];
      const date = seedDate("01", index);
      await connection.query(
        "INSERT INTO users (login,email,password_hash,full_name,role,email_confirmed,created_at,updated_at) VALUES (?,?,?,?,?,TRUE,?,?)",
        [login, email, await hashPassword(seedPassword), fullName, role, date, date],
      );
    }

    const categories = [
      {
        title: "Programming Languages",
        description: "Language syntax, types, runtime behavior, and libraries.",
      },
      {
        title: "Web Development",
        description: "Browsers, web standards, frontend, and server-side web apps.",
      },
      {
        title: "Databases",
        description: "SQL, data modeling, query performance, and transactions.",
      },
      {
        title: "Algorithms & Data Structures",
        description: "Problem solving, complexity, and collections of data.",
      },
      {
        title: "Developer Tools",
        description: "Editors, version control, build systems, and command-line tools.",
      },
    ];

    for (let index = 0; index < categories.length; index += 1) {
      const date = seedDate("02", index);
      const { title, description } = categories[index];
      await connection.query(
        "INSERT INTO categories (title,description,created_at,updated_at) VALUES (?,?,?,?)",
        [title, description, date, date],
      );
    }

    const [userRows] = await connection.query("SELECT id,login FROM users ORDER BY id");
    const [categoryRows] = await connection.query("SELECT id,title FROM categories ORDER BY id");
    const userId = (login) => userRows.find((row) => row.login === login).id;
    const categoryId = (title) => categoryRows.find((row) => row.title === title).id;
    const posts = [
      ["K123", "L123", "active", "test1"],
      ["M32e", "No3221er", "active", "test2"],
      ["O3552", "P321", "active", "test3"],
      ["Qu323c", "R2m14", "inactive", "test4"],
      ["Sie322", "Ta323", "active", "test1"],
    ];
    const postIds = [];

    for (let index = 0; index < posts.length; index += 1) {
      const [title, content, status, login] = posts[index];
      const date = seedDate("03", index);
      const [result] = await connection.query(
        "INSERT INTO posts (author_id,title,content,status,publish_date,updated_at) VALUES (?,?,?,?,?,?)",
        [userId(login), title, content, status, date, date],
      );
      postIds.push(result.insertId);
    }

    const postCategories = [
      [postIds[0], categoryId("Programming Languages")],
      [postIds[1], categoryId("Web Development")],
      [postIds[2], categoryId("Databases")],
      [postIds[3], categoryId("Algorithms & Data Structures")],
      [postIds[4], categoryId("Programming Languages")],
      [postIds[4], categoryId("Web Development")],
    ];
    for (const [postId, categoryIdValue] of postCategories)
      await connection.query("INSERT INTO post_categories (post_id,category_id) VALUES (?,?)", [
        postId,
        categoryIdValue,
      ]);
    const comments = [
      [postIds[0], userId("test2"), "Uni", "active"],
      [postIds[0], userId("test3"), "Vic", "active"],
      [postIds[1], userId("test4"), "Whi", "inactive"],
      [postIds[2], userId("test1"), "Xr", "active"],
      [postIds[4], userId("test2"), "Ya", "active"],
    ];
    const commentIds = [];

    for (let index = 0; index < comments.length; index += 1) {
      const [postId, authorId, content, status] = comments[index];
      const date = seedDate("04", index);
      const [result] = await connection.query(
        "INSERT INTO comments (post_id,author_id,content,status,publish_date,updated_at) VALUES (?,?,?,?,?,?)",
        [postId, authorId, content, status, date, date],
      );
      commentIds.push(result.insertId);
    }

    const likes = [
      [userId("test2"), postIds[0], null, "like"],
      [userId("test3"), postIds[0], null, "like"],
      [userId("test1"), postIds[1], null, "like"],
      [userId("test4"), postIds[2], null, "dislike"],
      [userId("test4"), null, commentIds[0], "like"],
      [userId("admin"), null, commentIds[3], "dislike"],
    ];

    for (let index = 0; index < likes.length; index += 1) {
      const [authorId, postId, commentId, type] = likes[index];
      await connection.query(
        "INSERT INTO likes (author_id,post_id,comment_id,type,created_at) VALUES (?,?,?,?,?)",
        [authorId, postId, commentId, type, seedDate("05", index)],
      );
    }

    await Like.lockUsers(connection);
    await Like.recalculate(connection);
  });
};
