import { assertDateRange, assertNonEmpty, parse } from "../schemas/parse.js";
import {
  createPost,
  updateUserPost,
  updateAdminPost,
  postQuery,
  favoritesQuery,
  createComment,
  createReaction,
  deleteReaction,
} from "../schemas/index.js";
import { idInput } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);
const normalizeQuery = (query) => {
  const result = { ...(query ?? {}) };
  for (const key of ["page", "page_size"])
    if (typeof result[key] === "number") result[key] = String(result[key]);
  return result;
};
export function createPostsService(posts, comments, reactions) {
  return {
    list: (query = {}, actor, internal = {}) => {
      const publicQuery = normalizeQuery(query);
      if (internal.direction !== undefined) delete publicQuery.direction;
      const parsed = assertDateRange(parse(postQuery, publicQuery, "query"));
      return posts.list(
        internal.direction
          ? { ...parsed, direction: internal.direction }
          : parsed,
        actor,
      );
    },
    favorites: (query = {}, actor) =>
      posts.listFavorites(
        parse(favoritesQuery, normalizeQuery(query), "query"),
        actor,
      ),
    get: (rawId, actor) => posts.get(id(rawId, "post_id"), actor),
    categories: (rawId, actor) => posts.categories(id(rawId, "post_id"), actor),
    create: (body, actor) =>
      posts.create(parse(createPost, body, "post"), actor),
    update: (rawId, body, actor) =>
      posts.update(
        id(rawId, "post_id"),
        assertNonEmpty(
          parse(
            actor?.role === "admin" ? updateAdminPost : updateUserPost,
            body,
            "post",
          ),
          "At least one editable post field is required",
        ),
        actor,
      ),
    delete: (rawId, actor) => posts.delete(id(rawId, "post_id"), actor),
    addFavorite: (rawId, actor) =>
      posts.addFavorite(id(rawId, "post_id"), actor),
    removeFavorite: (rawId, actor) =>
      posts.removeFavorite(id(rawId, "post_id"), actor),
    comments: (rawId, actor) =>
      comments.listForPost(id(rawId, "post_id"), actor),
    createComment: (rawId, body, actor) =>
      comments.create(
        id(rawId, "post_id"),
        parse(createComment, body, "comment"),
        actor,
      ),
    likes: (rawId, actor) =>
      reactions.list("post", id(rawId, "post_id"), actor),
    createLike: (rawId, body, actor) =>
      reactions.create(
        "post",
        id(rawId, "post_id"),
        parse(createReaction, body, "reaction").type,
        actor,
      ),
    deleteLike: (rawId, query, actor) => {
      const input = parse(deleteReaction, query ?? {}, "reaction");
      return reactions.delete(
        "post",
        id(rawId, "post_id"),
        actor,
        input.author_id,
      );
    },
  };
}
