import { ERROR_CODES } from "../constants/errorCodes.js";
import { fileURLToPath } from "node:url";
import { AppError } from "../errors/AppError.js";
import { adminCookieName } from "../middleware/adminSession.js";
import { MILLISECONDS_PER_HOUR } from "../constants/dates.js";

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
        maxAge: MILLISECONDS_PER_HOUR,
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
