import { ERROR_CODES } from "../constants/errorCodes.js";
import { AppError } from "../errors/AppError.js";

export const isAdmin = (user) => user?.role === "admin";

export const requireAuthenticatedUser = (user) => {
  if (!user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
  }
};

export const requireAdmin = (user) => {
  if (!isAdmin(user)) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, "Admin access required");
  }
};
