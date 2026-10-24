import { ERROR_CODES } from "../constants/errorCodes.js";
import { AppError } from "../errors/AppError.js";

const fields = "id,title,description,created_at,updated_at";
const categoryConflict = (error) => {
  if (error.code === "ER_DUP_ENTRY") {
    throw new AppError(409, ERROR_CODES.CATEGORY_EXISTS, "Category already exists");
  }
  throw error;
};

export class Category {
  constructor(db) {
    this.db = db;
  }

  async list() {
    const [rows] = await this.db.query(
      `SELECT ${fields} FROM categories ORDER BY title,id`,
    );
    return rows;
  }

  async get(id) {
    const [rows] = await this.db.query(
      `SELECT ${fields} FROM categories WHERE id = ?`,
      [id],
    );
    if (!rows[0])
      throw new AppError(
        404,
        ERROR_CODES.CATEGORY_NOT_FOUND,
        "Category not found",
      );
    return rows[0];
  }

  async create(input) {
    try {
      const [result] = await this.db.query(
        "INSERT INTO categories (title,description) VALUES (?,?)",
        [input.title.trim(), input.description || null],
      );
      return this.get(result.insertId);
    } catch (error) {
      categoryConflict(error);
    }
  }

  async update(id, input) {
    await this.get(id);
    const columns = [];
    const values = [];
    if (input.title !== undefined) {
      columns.push("title = ?");
      values.push(input.title.trim());
    }
    if (input.description !== undefined) {
      columns.push("description = ?");
      values.push(input.description || null);
    }
    if (columns.length) {
      try {
        await this.db.query(
          `UPDATE categories SET ${columns.join(", ")} WHERE id = ?`,
          [...values, id],
        );
      } catch (error) {
        categoryConflict(error);
      }
    }
    return this.get(id);
  }

  async delete(id) {
    await this.get(id);
    await this.db.query("DELETE FROM categories WHERE id = ?", [id]);
    return { id: Number(id) };
  }
}
