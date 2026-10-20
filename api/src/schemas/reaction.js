import { optional, strictObject } from "valibot";
import { idInput, reactionType } from "./common.js";

export const createReaction = strictObject({ type: reactionType });
export const deleteReaction = strictObject({ author_id: optional(idInput) });
