import {
  array,
  custom,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  pipe,
  regex,
  string,
  transform,
  union,
} from "valibot";
import {
  DATE_ONLY_PATTERN,
  URL_SAFE_CHARACTERS_PATTERN,
} from "../constants/regex.js";
import {
  POSITIVE_INTEGER_PATTERN,
  EMAIL_PATTERN,
  SECURE_TOKEN_PATTERN,
  ROLE_PATTERN,
  STATUS_PATTERN,
  REACTION_TYPE_PATTERN,
  REACTION_TARGET_PATTERN,
  MIN_DATE,
  MAX_DATE,
  UTC_DAY_START_SUFFIX,
  DATE_ONLY_LENGTH,
} from "./constants.js";

export const id = pipe(number(), integer(), minValue(1), maxValue(2147483647));
export const idInput = pipe(
  string(),
  regex(POSITIVE_INTEGER_PATTERN, "must be a positive integer"),
  transform(Number),
  id,
);
export const text = (min, max) =>
  pipe(
    string(),
    transform((value) => value.trim()),
    minLength(min),
    maxLength(max),
    custom((value) => !value.includes("\0")),
  );
export const login = pipe(text(3, 40), regex(URL_SAFE_CHARACTERS_PATTERN));
export const email = pipe(
  text(3, 254),
  transform((value) => value.toLowerCase()),
  regex(EMAIL_PATTERN),
);
export const password = pipe(
  string(),
  minLength(8),
  maxLength(128),
  custom((value) => !value.includes("\0")),
);
export const token = pipe(string(), regex(SECURE_TOKEN_PATTERN));
export const role = pipe(string(), regex(ROLE_PATTERN));
export const status = pipe(string(), regex(STATUS_PATTERN));
export const reactionType = pipe(string(), regex(REACTION_TYPE_PATTERN));
export const reactionTarget = pipe(string(), regex(REACTION_TARGET_PATTERN));
export const date = pipe(
  string(),
  regex(DATE_ONLY_PATTERN),
  custom((value) => {
    const parsed = new Date(`${value}${UTC_DAY_START_SUFFIX}`);
    return (
      value >= MIN_DATE &&
      value <= MAX_DATE &&
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, DATE_ONLY_LENGTH) === value
    );
  }),
);
export const categories = pipe(
  array(union([id, idInput]), "category IDs"),
  minLength(1),
  maxLength(100),
  custom((value) => new Set(value).size === value.length),
);
