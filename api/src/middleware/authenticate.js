import { ERROR_CODES } from "../constants/errorCodes.js";
import { verifyAuthToken } from "../utils/authToken.js";
import { AppError } from "../errors/AppError.js";
import { BEARER_HEADER_PATTERN } from "../constants/regex.js";

export const authenticate = (users, secret, optional = false) => {
  return async (request, response, next) => {
    const header = request.get("authorization");

    if (!header && optional) {
      request.user = null;

      return next();
    }

    if (!header || !BEARER_HEADER_PATTERN.test(header))
      throw new AppError(401, ERROR_CODES.UNAUTHENTICATED, "A bearer token is required");
    const payload = verifyAuthToken(header.slice(7), secret);
    const user = await users.findAuthById(payload.uid);
    if (!user || !user.email_confirmed || user.auth_version !== payload.version)
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHENTICATED,
        "Session has expired or been invalidated",
      );
    request.user = { id: user.id, role: user.role, email: user.email };
    next();
  };
};
