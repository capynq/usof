import { Router } from "express";

export const commentsRoutes = (controller, authenticate, optional, admin) => {
  const router = Router();
  router.get("/", authenticate, admin, controller.list);
  router.get("/:comment_id", optional, controller.get);
  router.get("/:comment_id/like", optional, controller.likes);
  router.post("/:comment_id/like", authenticate, controller.createLike);
  router.delete("/:comment_id/like", authenticate, controller.deleteLike);
  router.patch("/:comment_id", authenticate, controller.update);
  router.delete("/:comment_id", authenticate, controller.delete);

  return router;
};
