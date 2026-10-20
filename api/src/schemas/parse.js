import { ERROR_CODES } from "../constants/errorCodes.js";
import { flatten, safeParse } from "valibot";
import { AppError } from "../errors/AppError.js";

export function parse(schema, input, label = "input") {
  const result = safeParse(schema, input);
  if (result.success) return result.output;
  const details = flatten(result.issues);
  const message = result.issues[0]?.message || `${label} is invalid`;
  const error = new AppError(400, ERROR_CODES.VALIDATION_ERROR, message);
  error.fieldErrors =
    details.nested ?? (details.root ? { [label]: details.root } : {});
  throw error;
}

export function assertNonEmpty(
  input,
  message = "At least one field is required",
) {
  if (!input || Object.keys(input).length === 0)
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, message);
  return input;
}

export function assertDateRange(input) {
  if (input.date_from && input.date_to && input.date_from > input.date_to)
    throw new AppError(
      400,
      ERROR_CODES.VALIDATION_ERROR,
      "date_from must not be after date_to",
    );
  return input;
}
