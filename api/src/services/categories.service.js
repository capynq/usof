import { assertDateRange, assertNonEmpty, parse } from "../schemas/parse.js";
import { createCategory, updateCategory, postQuery } from "../schemas/index.js";
import { idInput } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);
const normalizeQuery = (query) => {
  const result = { ...(query ?? {}) };
  for (const key of ["page", "page_size"])
    if (typeof result[key] === "number") result[key] = String(result[key]);
  return result;
};
export function createCategoriesService(categories, posts) {
  return {
    list: () => categories.list(),
    get: (rawId) => categories.get(id(rawId, "category_id")),
    posts: async (rawId, query, actor) => {
      const categoryId = id(rawId, "category_id");
      const parsed = assertDateRange(
        parse(postQuery, normalizeQuery(query), "query"),
      );
      const category = await categories.get(categoryId);
      return posts.list({ ...parsed, categories: [category.id] }, actor);
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
