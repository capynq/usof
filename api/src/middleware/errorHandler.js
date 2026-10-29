import { ERROR_CODES } from "../constants/errorCodes.js";
import multer from "multer";
import { AppError } from "../errors/AppError.js";

const mapError = (error) => {
  if (error instanceof multer.MulterError)
    return new AppError(
      400,
      ERROR_CODES.UPLOAD_ERROR,
      "Upload must contain exactly one avatar image, at most 2 MiB",
    );
  else if (error.type === "entity.parse.failed")
    return new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Malformed JSON body");
  else if (error.type === "entity.too.large")
    return new AppError(413, ERROR_CODES.PAYLOAD_TOO_LARGE, "Request body is too large");
  else if (error.status === 404)
    return new AppError(404, ERROR_CODES.NOT_FOUND, "Resource not found");
  else if (error.status === 403 && !(error instanceof AppError))
    return new AppError(403, ERROR_CODES.FORBIDDEN, "Access denied");
  else if (error.code === "ER_DUP_ENTRY")
    return new AppError(409, ERROR_CODES.CONFLICT, "A unique value or reaction already exists");
  else if (
    ["ER_NO_REFERENCED_ROW_2", "ER_ROW_IS_REFERENCED_2", "ER_CHECK_CONSTRAINT_VIOLATED"].includes(
      error.code,
    )
  )
    return new AppError(
      400,
      ERROR_CODES.VALIDATION_ERROR,
      "Related data is missing or violates a constraint",
    );
  else if (["ER_LOCK_DEADLOCK", "ER_LOCK_WAIT_TIMEOUT"].includes(error.code))
    return new AppError(
      409,
      ERROR_CODES.CONFLICT,
      "Concurrent operation conflict; retry the request",
    );

  return error;
};

export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);
  const result = mapError(error);

  if (!(result instanceof AppError)) {
    console.error("Unexpected request failure");
    const internalError = new AppError(
      500,
      ERROR_CODES.INTERNAL_ERROR,
      "An unexpected server error occurred",
    );

    return response.status(internalError.status).json({
      error: {
        code: internalError.code,
        message: internalError.message,
      },
    });
  }

  const body = { code: result.code, message: result.message };
  if (result.details !== undefined) body.details = result.details;
  response.status(result.status).json({ error: body });
};
