import express, { Router } from "express";
import AdminJSExpress from "@adminjs/express";
import { fileURLToPath } from "node:url";
import { createAdmin } from "../config/admin.js";
import { adminAuthController } from "../controllers/adminAuth.controller.js";
import { adminSession, sameOrigin } from "../middleware/adminSession.js";

export const adminRoutes = async (services, users, config) => {
  const admin = await createAdmin(services);
  const controller = adminAuthController(services.auth, config);
  const router = Router();
  router.use(sameOrigin(config));
  router.use(
    "/auth-assets",
    express.static(fileURLToPath(new URL("../views/assets/", import.meta.url)), {
      dotfiles: "deny",
    }),
  );
  router.get("/login", controller.loginPage);
  router.post("/login", express.json({ limit: "4kb" }), controller.login);
  router.use(adminSession(users, config));
  router.get("/", controller.home);
  router.get("/logout", controller.logoutPage);
  router.post("/logout", controller.logout);
  router.use(
    AdminJSExpress.buildRouter(admin, undefined, {
      maxFileSize: 0,
      maxFieldsSize: 128 * 1024,
      multiples: false,
    }),
  );

  return router;
};
