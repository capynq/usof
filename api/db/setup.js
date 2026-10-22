import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createDatabasePool } from "../src/config/database.js";
import { DATABASE_NAME_PATTERN } from "../src/constants/regex.js";
import { seed } from "./seed.js";

const assertSafeDatabaseName = (database) => {
  if (!DATABASE_NAME_PATTERN.test(database)) {
    throw new Error("Refusing unsafe database name");
  }
};

const ensureCommentRelationships = async (server, database) => {
  const [columns] = await server.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'comments'",
    [database],
  );
  const columnNames = new Set(columns.map((column) => column.COLUMN_NAME));
  if (!columnNames.has("parent_id")) {
    await server.query(
      "ALTER TABLE comments ADD COLUMN parent_id INT UNSIGNED NULL AFTER post_id",
    );
  }

  if (!columnNames.has("is_deleted")) {
    await server.query(
      "ALTER TABLE comments ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE AFTER status",
    );
  }

  const [parentIndex] = await server.query(
    "SELECT INDEX_NAME,COLUMN_NAME,SEQ_IN_INDEX FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'comments' AND INDEX_NAME = 'comments_parent_idx' ORDER BY SEQ_IN_INDEX",
    [database],
  );
  if (
    parentIndex.length !== 1 ||
    parentIndex[0].COLUMN_NAME !== "parent_id" ||
    Number(parentIndex[0].SEQ_IN_INDEX) !== 1
  ) {
    if (parentIndex.length) {
      await server.query(
        "ALTER TABLE comments DROP INDEX comments_parent_idx",
      );
    }

    await server.query(
      "ALTER TABLE comments ADD KEY comments_parent_idx (parent_id)",
    );
  }

  const [parentConstraint] = await server.query(
    "SELECT kcu.CONSTRAINT_NAME,kcu.COLUMN_NAME,kcu.REFERENCED_TABLE_NAME,kcu.REFERENCED_COLUMN_NAME,rc.DELETE_RULE FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA AND rc.TABLE_NAME = kcu.TABLE_NAME AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME WHERE kcu.CONSTRAINT_SCHEMA = ? AND kcu.TABLE_NAME = 'comments' AND kcu.CONSTRAINT_NAME = 'comments_parent_fk' ORDER BY kcu.ORDINAL_POSITION",
    [database],
  );
  const hasExpectedParentConstraint =
    parentConstraint.length === 1 &&
    parentConstraint[0].COLUMN_NAME === "parent_id" &&
    parentConstraint[0].REFERENCED_TABLE_NAME === "comments" &&
    parentConstraint[0].REFERENCED_COLUMN_NAME === "id" &&
    parentConstraint[0].DELETE_RULE === "SET NULL";
  if (parentConstraint.length && !hasExpectedParentConstraint) {
    await server.query(
      "ALTER TABLE comments DROP FOREIGN KEY comments_parent_fk",
    );
  }

  if (!hasExpectedParentConstraint) {
    await server.query(
      "ALTER TABLE comments ADD CONSTRAINT comments_parent_fk FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL",
    );
  }
};

export const setupDatabase = async (config, { recreate = false } = {}) => {
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
    if (recreate) {
      await server.query(`DROP DATABASE IF EXISTS \`${database}\``);
    }

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
      .filter(Boolean)) {
      await server.query(statement);
    }

    await ensureCommentRelationships(server, database);
  } finally {
    await server.end();
  }

  const pool = createDatabasePool(config);
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    if (Number(rows[0].count) === 0) {
      await seed(pool, config);
    }
  } finally {
    await pool.end();
  }
};
