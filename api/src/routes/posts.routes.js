import { Router } from "express";

export const postsRoutes = (controller, authenticate, optional) => {
  const router = Router();
  router.get("/", optional, controller.list);
  router.post("/", authenticate, controller.create);
  router.get("/:post_id", optional, controller.get);
  router.get("/:post_id/comments", optional, controller.comments);
  router.post("/:post_id/comments", authenticate, controller.createComment);
  router.get("/:post_id/categories", optional, controller.categories);
  router.get("/:post_id/like", optional, controller.likes);
  router.post("/:post_id/like", authenticate, controller.createLike);
  router.delete("/:post_id/like", authenticate, controller.deleteLike);
  router.post("/:post_id/favorite", authenticate, controller.addFavorite);
  router.delete("/:post_id/favorite", authenticate, controller.removeFavorite);
  router.patch("/:post_id", authenticate, controller.update);
  router.delete("/:post_id", authenticate, controller.delete);

  return router;
};
