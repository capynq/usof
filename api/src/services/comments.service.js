import { parse } from "../schemas/parse.js";
import {
  createComment,
  updateComment,
  createReaction,
  deleteReaction,
} from "../schemas/index.js";
import { idInput } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);
export const createCommentsService = (comments, reactions) => {
  return {
    list: (user) => comments.list(user),
    get: (rawId, user) => comments.get(id(rawId, "comment_id"), user),
    listForPost: (rawId, user) =>
      comments.listForPost(id(rawId, "post_id"), user),
    create: (rawId, body, user) =>
      comments.create(
        id(rawId, "post_id"),
        parse(createComment, body, "comment"),
        user,
      ),
    update: (rawId, body, user) =>
      comments.update(
        id(rawId, "comment_id"),
        parse(updateComment, body, "comment"),
        user,
      ),
    delete: (rawId, user) => comments.delete(id(rawId, "comment_id"), user),
    likes: (rawId, user) =>
      reactions.list("comment", id(rawId, "comment_id"), user),
    createLike: (rawId, body, user) =>
      reactions.create(
        "comment",
        id(rawId, "comment_id"),
        parse(createReaction, body, "reaction").type,
        user,
      ),
    deleteLike: (rawId, query, user) => {
      const input = parse(deleteReaction, query ?? {}, "reaction");
      return reactions.delete(
        "comment",
        id(rawId, "comment_id"),
        user,
        input.author_id,
      );
    },
  };
};
