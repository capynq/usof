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
import { normalizePaginationQuery } from "./query.js";

const id = (value, name) => parse(idInput, String(value), name);
export const createPostsService = (posts, comments, reactions) => ({
  list: (query = {}, user, internal = {}) => {
    const publicQuery = normalizePaginationQuery(query);
    if (internal.direction !== undefined) {
      delete publicQuery.direction;
    }

    const parsed = assertDateRange(parse(postQuery, publicQuery, "query"));
    return posts.list(
      internal.direction
        ? { ...parsed, direction: internal.direction }
        : parsed,
      user,
    );
  },
  favorites: (query = {}, user) =>
    posts.listFavorites(
      parse(favoritesQuery, normalizePaginationQuery(query), "query"),
      user,
    ),
  get: (rawId, user) => posts.get(id(rawId, "post_id"), user),
  categories: (rawId, user) => posts.categories(id(rawId, "post_id"), user),
  create: (body, user) =>
    posts.create(parse(createPost, body, "post"), user),
  update: (rawId, body, user) =>
    posts.update(
      id(rawId, "post_id"),
      assertNonEmpty(
        parse(
          user?.role === "admin" ? updateAdminPost : updateUserPost,
          body,
          "post",
        ),
        "At least one editable post field is required",
      ),
      user,
    ),
  delete: (rawId, user) => posts.delete(id(rawId, "post_id"), user),
  addFavorite: (rawId, user) =>
    posts.addFavorite(id(rawId, "post_id"), user),
  removeFavorite: (rawId, user) =>
    posts.removeFavorite(id(rawId, "post_id"), user),
  comments: (rawId, user) =>
    comments.listForPost(id(rawId, "post_id"), user),
  createComment: (rawId, body, user) =>
    comments.create(
      id(rawId, "post_id"),
      parse(createComment, body, "comment"),
      user,
    ),
  likes: (rawId, user) =>
    reactions.list("post", id(rawId, "post_id"), user),
  createLike: (rawId, body, user) =>
    reactions.create(
      "post",
      id(rawId, "post_id"),
      parse(createReaction, body, "reaction").type,
      user,
    ),
  deleteLike: (rawId, query, user) => {
    const input = parse(deleteReaction, query ?? {}, "reaction");
    return reactions.delete(
      "post",
      id(rawId, "post_id"),
      user,
      input.author_id,
    );
  },
});
