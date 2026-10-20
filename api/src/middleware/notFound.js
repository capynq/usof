import { ERROR_CODES } from "../constants/errorCodes.js";
import { AppError } from "../errors/AppError.js";

export function notFound(request, response, next) {
  next(new AppError(404, ERROR_CODES.NOT_FOUND, "Resource not found"));
}
