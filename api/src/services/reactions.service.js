import { ERROR_CODES } from "../constants/errorCodes.js";
import { parse } from "../schemas/parse.js";
import { AppError } from "../errors/AppError.js";
import { createReaction, deleteReaction } from "../schemas/index.js";
import { idInput, reactionTarget } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);
export function createReactionsService(likes) {
  return {
    list: (target, rawId, actor) =>
      likes.list(
        parse(reactionTarget, target, "target"),
        id(rawId, `${target}_id`),
        actor,
      ),
    listAll: (actor) => likes.listAll(actor),
    get: (rawId, actor) => likes.get(id(rawId, "reaction_id"), actor),
    create: (target, rawId, rawType, actor) =>
      likes.create(
        parse(reactionTarget, target, "target"),
        id(rawId, `${target}_id`),
        parse(createReaction, { type: rawType }, "reaction").type,
        actor,
      ),
    delete: (target, rawId, actor, rawAuthorId) => {
      const input = parse(
        deleteReaction,
        rawAuthorId === undefined ? {} : { author_id: String(rawAuthorId) },
        "reaction",
      );
      if (
        actor?.role !== "admin" &&
        input.author_id !== undefined &&
        input.author_id !== Number(actor?.id)
      )
        throw new AppError(
          403,
          ERROR_CODES.FORBIDDEN,
          "You may delete only your own reactions",
        );
      return likes.delete(
        parse(reactionTarget, target, "target"),
        id(rawId, `${target}_id`),
        actor,
        input.author_id,
      );
    },
    deleteById: async (rawId, actor) => {
      const reaction = await likes.get(id(rawId, "reaction_id"), actor);
      return likes.delete(
        reaction.post_id ? "post" : "comment",
        reaction.post_id ?? reaction.comment_id,
        actor,
        reaction.author_id,
      );
    },
  };
}
