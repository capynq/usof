import { ERROR_CODES } from "../constants/errorCodes.js";
import { AppError } from "../errors/AppError.js";

export const authorizeRole = (role) => (request, response, next) => {
  if (request.user?.role !== role)
    throw new AppError(
      403,
      ERROR_CODES.FORBIDDEN,
      "Administrator access required",
    );
  next();
};
