import { ERROR_CODES } from "../constants/errorCodes.js";
import { verifyAuthToken } from "../utils/authToken.js";
import { AppError } from "../errors/AppError.js";

export const adminCookieName = "usof_admin";

export function adminSession(users, config) {
  return async (request, response, next) => {
    const token = request
      .get("cookie")
      ?.split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(`${adminCookieName}=`))
      ?.slice(adminCookieName.length + 1);
    let payload;
    try {
      payload = verifyAuthToken(token, config.authSecret);
    } catch {
      if (request.path.startsWith("/api/"))
        throw new AppError(
          401,
          ERROR_CODES.UNAUTHENTICATED,
          "Administrator login required",
        );
      return response.redirect("/admin/login");
    }
    const user = await users.findAuthById(payload.uid);
    if (
      !user ||
      !user.email_confirmed ||
      user.auth_version !== payload.version
    ) {
      response.clearCookie(adminCookieName, { path: "/admin" });
      if (request.path.startsWith("/api/"))
        throw new AppError(
          401,
          ERROR_CODES.UNAUTHENTICATED,
          "Administrator session expired",
        );
      return response.redirect("/admin/login");
    }
    if (user.role !== "admin")
      throw new AppError(
        403,
        ERROR_CODES.FORBIDDEN,
        "Administrator access required",
      );
    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      login: user.login,
    };
    request.session = { adminUser: request.user };
    next();
  };
}

export const sameOrigin = (config) => (request, response, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    request.get("origin") !== config.baseUrl
  ) {
    throw new AppError(
      403,
      ERROR_CODES.FORBIDDEN,
      "Admin forms must be submitted from APP_BASE_URL",
    );
  }
  next();
};
