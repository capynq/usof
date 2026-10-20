import { strictObject } from "valibot";
import { status, text } from "./common.js";

export const createComment = strictObject({ content: text(1, 10000) });
export const updateComment = strictObject({ status });
