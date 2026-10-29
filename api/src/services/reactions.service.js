import { ERROR_CODES } from "../constants/errorCodes.js";
import { parse } from "../schemas/parse.js";
import { AppError } from "../errors/AppError.js";
import { createReaction, deleteReaction } from "../schemas/index.js";
import { idInput, reactionTarget } from "../schemas/common.js";

const id = (value, name) => parse(idInput, String(value), name);

export const createReactionsService = (likes) => {
  return {
    list: (target, rawId, user) =>
      likes.list(parse(reactionTarget, target, "target"), id(rawId, `${target}_id`), user),
    listAll: (user) => likes.listAll(user),
    get: (rawId, user) => likes.get(id(rawId, "reaction_id"), user),
    create: (target, rawId, rawType, user) =>
      likes.create(
        parse(reactionTarget, target, "target"),
        id(rawId, `${target}_id`),
        parse(createReaction, { type: rawType }, "reaction").type,
        user,
      ),
    delete: (target, rawId, user, rawAuthorId) => {
      const input = parse(
        deleteReaction,
        rawAuthorId === undefined ? {} : { author_id: String(rawAuthorId) },
        "reaction",
      );
      if (
        user?.role !== "admin" &&
        input.author_id !== undefined &&
        input.author_id !== Number(user?.id)
      )
        throw new AppError(403, ERROR_CODES.FORBIDDEN, "You may delete only your own reactions");

      return likes.delete(
        parse(reactionTarget, target, "target"),
        id(rawId, `${target}_id`),
        user,
        input.author_id,
      );
    },
    deleteById: async (rawId, user) => {
      const reaction = await likes.get(id(rawId, "reaction_id"), user);

      return likes.delete(
        reaction.post_id ? "post" : "comment",
        reaction.post_id ?? reaction.comment_id,
        user,
        reaction.author_id,
      );
    },
  };
};
