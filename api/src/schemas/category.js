import { optional, strictObject } from "valibot";
import { text } from "./common.js";

export const createCategory = strictObject({
  title: text(1, 100),
  description: optional(text(0, 2000)),
});
export const updateCategory = strictObject({
  title: optional(text(1, 100)),
  description: optional(text(0, 2000)),
});
