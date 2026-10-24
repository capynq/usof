import { assertDateRange, assertNonEmpty, parse } from "../schemas/parse.js";
import { createCategory, updateCategory, postQuery } from "../schemas/index.js";
import { idInput } from "../schemas/common.js";
import { normalizePaginationQuery } from "./query.js";

const id = (value, name) => parse(idInput, String(value), name);
export function createCategoriesService(categories, posts) {
  return {
    list: () => categories.list(),
    get: (rawId) => categories.get(id(rawId, "category_id")),
    posts: async (rawId, query, user) => {
      const categoryId = id(rawId, "category_id");
      const parsed = assertDateRange(
        parse(postQuery, normalizePaginationQuery(query), "query"),
      );
      const category = await categories.get(categoryId);
      return posts.list({ ...parsed, categories: [category.id] }, user);
    },
    create: (body) => {
      const input = parse(createCategory, body, "category");
      return categories.create({
        ...input,
        description: input.description ?? "",
      });
    },
    update: (rawId, body) =>
      categories.update(
        id(rawId, "category_id"),
        assertNonEmpty(
          parse(updateCategory, body, "category"),
          "At least one category field is required",
        ),
      ),
    delete: (rawId) => categories.delete(id(rawId, "category_id")),
  };
}
