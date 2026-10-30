import {
  optional,
  strictObject,
  pipe,
  string,
  transform,
  regex,
  maxValue,
} from "valibot";
import { categories, date, idInput, status, text } from "./common.js";
import { BOOLEAN_STRING_PATTERN, POST_SORT_PATTERN } from "../constants/regex.js";

const categoriesQuery = pipe(
  string(),
  transform((value) => value.split(",")),
  categories,
);
export const createPost = strictObject({
  title: text(1, 200),
  content: text(1, 50000),
  categories,
});
export const updatePost = strictObject({
  title: optional(text(1, 200)),
  content: optional(text(1, 50000)),
  categories: optional(categories),
  status: optional(status),
});
export const postQuery = strictObject({
  page: optional(pipe(idInput, maxValue(1000000))),
  page_size: optional(pipe(idInput, maxValue(100))),
  sort: optional(pipe(string(), regex(POST_SORT_PATTERN))),
  direction: optional(pipe(string(), regex(/^(asc|desc)$/))),
  categories: optional(categoriesQuery),
  search: optional(text(1, 100)),
  author_id: optional(idInput),
  summary: optional(
    pipe(
      string(),
      regex(BOOLEAN_STRING_PATTERN),
      transform((value) => value === "true"),
    ),
  ),
  date_from: optional(date),
  date_to: optional(date),
  status: optional(status),
});
export const favoritesQuery = strictObject({
  page: optional(pipe(idInput, maxValue(1000000))),
  page_size: optional(pipe(idInput, maxValue(100))),
});
