import { ERROR_CODES } from "../constants/errorCodes.js";
import { transaction } from "../config/database.js";
import { AppError } from "../errors/AppError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createSecureToken, hashSecureToken } from "../utils/secureToken.js";
import { Like } from "./Like.js";

const publicFields =
  "id,login,full_name,role,profile_picture,rating,created_at,updated_at";
const safeFields = `${publicFields},email`;
const authFields =
  "id,login,email,password_hash,full_name,role,email_confirmed,auth_version,profile_picture,rating,created_at,updated_at";

const isAdmin = (actor) => actor?.role === "admin";
const sameUser = (actor, id) => Number(actor?.id) === Number(id);

const safe = (row, viewer) => {
  if (!row) return null;
  const {
    password_hash,
    email_confirmation_token_hash,
    email_confirmation_expires_at,
    password_reset_token_hash,
    password_reset_expires_at,
    auth_version,
    email_confirmed,
    ...user
  } = row;
  if (!isAdmin(viewer) && !sameUser(viewer, row.id)) delete user.email;
  return user;
};

const duplicate = (error) => {
  if (error.code === "ER_DUP_ENTRY")
    throw new AppError(
      409,
      ERROR_CODES.USER_EXISTS,
      "Login or email already exists",
    );
  throw error;
};

export class User {
  constructor(db) {
    this.db = db;
  }

  async list(viewer) {
    const [rows] = await this.db.query(
      `SELECT ${safeFields} FROM users ORDER BY id`,
    );
    return rows.map((row) => safe(row, viewer));
  }

  async get(id, viewer) {
    const [rows] = await this.db.query(
      `SELECT ${safeFields} FROM users WHERE id = ?`,
      [id],
    );
    if (!rows[0])
      throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
    return safe(rows[0], viewer);
  }

  async findAuthById(id) {
    const [rows] = await this.db.query(
      `SELECT ${authFields} FROM users WHERE id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async login({ login, email, password }) {
    const [rows] = await this.db.query(
      `SELECT ${authFields} FROM users WHERE login = ? AND email = ? LIMIT 1`,
      [login, email],
    );
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash)))
      throw new AppError(
        401,
        ERROR_CODES.INVALID_CREDENTIALS,
        "Invalid credentials",
      );
    if (!user.email_confirmed)
      throw new AppError(
        403,
        ERROR_CODES.ACCOUNT_UNCONFIRMED,
        "Account is not confirmed",
      );
    return user;
  }

  async register(input) {
    const confirmation = createSecureToken();
    return transaction(this.db, async (connection) => {
      const [existing] = await connection.query(
        "SELECT id FROM users WHERE login = ? OR email = ? FOR UPDATE",
        [input.login, input.email],
      );
      if (existing.length)
        throw new AppError(
          409,
          ERROR_CODES.USER_EXISTS,
          "Login or email already exists",
        );
      let result;
      try {
        [result] = await connection.query(
          "INSERT INTO users (login,email,password_hash,full_name,role,email_confirmed,email_confirmation_token_hash,email_confirmation_expires_at) VALUES (?,?,?,?, 'user',FALSE,?,?)",
          [
            input.login,
            input.email,
            await hashPassword(input.password),
            input.full_name || null,
            confirmation.hash,
            confirmation.expiresAt,
          ],
        );
      } catch (error) {
        duplicate(error);
      }
      const [rows] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [result.insertId],
      );
      return {
        user: safe(rows[0], { id: result.insertId }),
        token: confirmation.token,
      };
    });
  }

  async create(input) {
    return transaction(this.db, async (connection) => {
      const [existing] = await connection.query(
        "SELECT id FROM users WHERE login = ? OR email = ? FOR UPDATE",
        [input.login, input.email],
      );
      if (existing.length)
        throw new AppError(
          409,
          ERROR_CODES.USER_EXISTS,
          "Login or email already exists",
        );
      let result;
      try {
        [result] = await connection.query(
          "INSERT INTO users (login,email,password_hash,full_name,role,email_confirmed) VALUES (?,?,?,?,?,TRUE)",
          [
            input.login,
            input.email,
            await hashPassword(input.password),
            input.full_name || null,
            input.role === "admin" ? "admin" : "user",
          ],
        );
      } catch (error) {
        duplicate(error);
      }
      const [rows] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [result.insertId],
      );
      return safe(rows[0], { id: result.insertId, role: "admin" });
    });
  }

  async confirm(token) {
    return transaction(this.db, async (connection) => {
      const [rows] = await connection.query(
        "SELECT id FROM users WHERE email_confirmation_token_hash = ? AND email_confirmation_expires_at > UTC_TIMESTAMP() FOR UPDATE",
        [hashSecureToken(token)],
      );
      if (!rows[0])
        throw new AppError(
          400,
          ERROR_CODES.INVALID_TOKEN,
          "Invalid or expired confirmation token",
        );
      await connection.query(
        "UPDATE users SET email_confirmed = TRUE,email_confirmation_token_hash = NULL,email_confirmation_expires_at = NULL WHERE id = ?",
        [rows[0].id],
      );
      const [users] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [rows[0].id],
      );
      return safe(users[0], { id: rows[0].id });
    });
  }

  async requestConfirmation(email) {
    const [rows] = await this.db.query(
      "SELECT id FROM users WHERE email = ? AND email_confirmed = FALSE",
      [email],
    );
    if (!rows[0]) return null;
    const confirmation = createSecureToken();
    await this.db.query(
      "UPDATE users SET email_confirmation_token_hash = ?,email_confirmation_expires_at = ? WHERE id = ?",
      [confirmation.hash, confirmation.expiresAt, rows[0].id],
    );
    return {
      user: await this.get(rows[0].id, { id: rows[0].id }),
      token: confirmation.token,
    };
  }

  async requestReset(email) {
    const [rows] = await this.db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows[0]) return null;
    const reset = createSecureToken();
    await this.db.query(
      "UPDATE users SET password_reset_token_hash = ?,password_reset_expires_at = ? WHERE id = ?",
      [reset.hash, reset.expiresAt, rows[0].id],
    );
    return {
      user: await this.get(rows[0].id, { id: rows[0].id }),
      token: reset.token,
    };
  }

  async reset(token, newPassword) {
    return transaction(this.db, async (connection) => {
      const [rows] = await connection.query(
        "SELECT id FROM users WHERE password_reset_token_hash = ? AND password_reset_expires_at > UTC_TIMESTAMP() FOR UPDATE",
        [hashSecureToken(token)],
      );
      if (!rows[0])
        throw new AppError(
          400,
          ERROR_CODES.INVALID_TOKEN,
          "Invalid or expired reset token",
        );
      await connection.query(
        "UPDATE users SET password_hash = ?,password_reset_token_hash = NULL,password_reset_expires_at = NULL,auth_version = auth_version + 1 WHERE id = ?",
        [await hashPassword(newPassword), rows[0].id],
      );
      const [users] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [rows[0].id],
      );
      return safe(users[0], { id: rows[0].id });
    });
  }

  async logout(id) {
    const [result] = await this.db.query(
      "UPDATE users SET auth_version = auth_version + 1 WHERE id = ?",
      [id],
    );
    if (!result.affectedRows)
      throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
    return { id: Number(id) };
  }

  async update(id, input, actor) {
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    if (!isAdmin(actor) && !sameUser(actor, id))
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
    return transaction(this.db, async (connection) => {
      const [targets] = await connection.query(
        "SELECT id,email FROM users WHERE id = ? FOR UPDATE",
        [id],
      );
      if (!targets[0])
        throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
      const fields = [];
      const values = [];
      for (const key of ["login", "full_name"]) {
        if (input[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(input[key]);
        }
      }
      if (isAdmin(actor) && input.role !== undefined) {
        fields.push("role = ?");
        values.push(input.role);
      }
      let confirmation = null;
      if (input.email !== undefined && input.email !== targets[0].email) {
        confirmation = createSecureToken();
        fields.push(
          "email = ?",
          "email_confirmed = FALSE",
          "email_confirmation_token_hash = ?",
          "email_confirmation_expires_at = ?",
          "auth_version = auth_version + 1",
          "password_reset_token_hash = NULL",
          "password_reset_expires_at = NULL",
        );
        values.push(input.email, confirmation.hash, confirmation.expiresAt);
      }
      if (fields.length) {
        try {
          await connection.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            [...values, id],
          );
        } catch (error) {
          duplicate(error);
        }
      }
      const [rows] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [id],
      );
      const user = safe(rows[0], actor);
      return confirmation ? { user, token: confirmation.token } : user;
    });
  }

  async delete(id, actor) {
    if (!actor)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required",
      );
    if (!isAdmin(actor) && !sameUser(actor, id))
      throw new AppError(403, ERROR_CODES.FORBIDDEN, "Not allowed");
    return transaction(this.db, async (connection) => {
      await Like.lockUsers(connection);
      const [rows] = await connection.query(
        "SELECT profile_picture FROM users WHERE id = ? FOR UPDATE",
        [id],
      );
      if (!rows[0])
        throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
      await connection.query("DELETE FROM users WHERE id = ?", [id]);
      await Like.recalculate(connection);
      return {
        avatarPaths: rows[0].profile_picture ? [rows[0].profile_picture] : [],
      };
    });
  }

  async setAvatar(id, path) {
    return transaction(this.db, async (connection) => {
      const [rows] = await connection.query(
        "SELECT profile_picture FROM users WHERE id = ? FOR UPDATE",
        [id],
      );
      if (!rows[0])
        throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
      await connection.query(
        "UPDATE users SET profile_picture = ? WHERE id = ?",
        [path, id],
      );
      const [users] = await connection.query(
        `SELECT ${safeFields} FROM users WHERE id = ?`,
        [id],
      );
      return { user: safe(users[0], { id }), oldPath: rows[0].profile_picture };
    });
  }
}
