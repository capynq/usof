import { Router } from "express";
import { uploadAvatar } from "../middleware/uploadAvatar.js";

export function usersRoutes(controller, authenticate, admin) {
  const router = Router();
  router.use(authenticate);
  router.get("/", admin, controller.list);
  router.post("/", admin, controller.create);
  router.patch("/avatar", uploadAvatar, controller.avatar);
  router.get("/:user_id", controller.get);
  router.patch("/:user_id", controller.update);
  router.delete("/:user_id", controller.delete);
  return router;
}
