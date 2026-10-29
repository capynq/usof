import { Router } from "express";

export const categoriesRoutes = (controller, authenticate, optional, admin) => {
  const router = Router();
  router.get("/", controller.list);
  router.get("/:category_id", controller.get);
  router.get("/:category_id/posts", optional, controller.posts);
  router.post("/", authenticate, admin, controller.create);
  router.patch("/:category_id", authenticate, admin, controller.update);
  router.delete("/:category_id", authenticate, admin, controller.delete);

  return router;
};
