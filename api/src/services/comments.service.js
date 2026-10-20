import { parse } from "../schemas/parse.js";
import {
  createComment,
  updateComment,
  createReaction,
  deleteReaction,
} from "../schemas/index.js";
import { idInput } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);
export function createCommentsService(comments, reactions) {
  return {
    list: (actor) => comments.list(actor),
    get: (rawId, actor) => comments.get(id(rawId, "comment_id"), actor),
    listForPost: (rawId, actor) =>
      comments.listForPost(id(rawId, "post_id"), actor),
    create: (rawId, body, actor) =>
      comments.create(
        id(rawId, "post_id"),
        parse(createComment, body, "comment"),
        actor,
      ),
    update: (rawId, body, actor) =>
      comments.update(
        id(rawId, "comment_id"),
        parse(updateComment, body, "comment"),
        actor,
      ),
    delete: (rawId, actor) => comments.delete(id(rawId, "comment_id"), actor),
    likes: (rawId, actor) =>
      reactions.list("comment", id(rawId, "comment_id"), actor),
    createLike: (rawId, body, actor) =>
      reactions.create(
        "comment",
        id(rawId, "comment_id"),
        parse(createReaction, body, "reaction").type,
        actor,
      ),
    deleteLike: (rawId, query, actor) => {
      const input = parse(deleteReaction, query ?? {}, "reaction");
      return reactions.delete(
        "comment",
        id(rawId, "comment_id"),
        actor,
        input.author_id,
      );
    },
  };
}
