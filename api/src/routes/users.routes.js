import { Router } from "express";
import { uploadAvatar } from "../middleware/uploadAvatar.js";

export const usersRoutes = (controller, authenticate, optional, admin) => {
  const router = Router();
  router.get("/:user_id", optional, controller.getPublic);
  router.use(authenticate);
  router.get("/", admin, controller.list);
  router.post("/", admin, controller.create);
  router.patch("/avatar", uploadAvatar, controller.avatar);
  router.patch("/:user_id", controller.update);
  router.delete("/:user_id", controller.delete);

  return router;
};
