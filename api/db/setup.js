import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../src/config/database.js";
import { DATABASE_NAME_PATTERN } from "../src/constants/regex.js";
import { seed } from "./seed.js";

function assertSafeDatabaseName(database) {
  if (!DATABASE_NAME_PATTERN.test(database))
    throw new Error("Refusing unsafe database name");
}

export async function setupDatabase(config, { recreate = false } = {}) {
  const database = config.db.database;
  assertSafeDatabaseName(database);
  const server = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    charset: "utf8mb4",
  });
  try {
    if (recreate) await server.query(`DROP DATABASE IF EXISTS \`${database}\``);
    await server.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await server.query(`USE \`${database}\``);
    const schema = await readFile(
      fileURLToPath(new URL("./schema.sql", import.meta.url)),
      "utf8",
    );
    for (const statement of schema
      .split(";")
      .map((value) => value.trim())
      .filter(Boolean))
      await server.query(statement);
  } finally {
    await server.end();
  }
  const pool = createDatabasePool(config);
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    if (Number(rows[0].count) === 0) await seed(pool, config);
  } finally {
    await pool.end();
  }
}
