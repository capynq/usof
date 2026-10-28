import { ERROR_CODES } from "../constants/errorCodes.js";
import { fileURLToPath } from "node:url";
import { AppError } from "../errors/AppError.js";
import { adminCookieName } from "../middleware/adminSession.js";
import { MILLISECONDS_PER_SECOND } from "../constants/dates.js";
import { AUTH_SESSION_SECONDS } from "../constants/auth.js";

const view = (name) =>
  fileURLToPath(new URL(`../views/${name}`, import.meta.url));

export const adminAuthController = (auth, config) => {
  return {
    home: (request, response) => response.redirect("/admin/resources/Users"),
    loginPage: (request, response) =>
      response.sendFile(view("admin-login.html")),
    logoutPage: (request, response) =>
      response.sendFile(view("admin-logout.html")),
    login: async (request, response) => {
      const { user, token } = await auth.login(request.body);
      if (user.role !== "admin")
        throw new AppError(
          403,
          ERROR_CODES.FORBIDDEN,
          "Administrator access required",
        );
      response.cookie(adminCookieName, token, {
        httpOnly: true,
        secure: config.production,
        sameSite: "strict",
        path: "/admin",
        maxAge: AUTH_SESSION_SECONDS * MILLISECONDS_PER_SECOND,
      });
      response.json({ data: { redirect: "/admin" } });
    },
    logout: async (request, response) => {
      await auth.logout(request.user);
      response.clearCookie(adminCookieName, { path: "/admin" });
      response.json({ data: { redirect: "/admin/login" } });
    },
  };
};
