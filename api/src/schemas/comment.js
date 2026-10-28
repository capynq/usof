import { optional, strictObject, union } from "valibot";
import { id, idInput, status, text } from "./common.js";

export const createComment = strictObject({
  content: text(1, 10000),
  parent_id: optional(union([id, idInput])),
});
export const updateComment = union([
  strictObject({ status }),
  strictObject({ content: text(1, 10000) }),
]);
