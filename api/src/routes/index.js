import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { usersRoutes } from "./users.routes.js";
import { postsRoutes } from "./posts.routes.js";
import { categoriesRoutes } from "./categories.routes.js";
import { commentsRoutes } from "./comments.routes.js";

export const apiRoutes = (controllers, authenticate, optional, admin) => {
  const router = Router();
  router.use("/auth", authRoutes(controllers.auth, authenticate));
  router.use("/users", usersRoutes(controllers.users, authenticate, optional, admin));
  router.use("/posts", postsRoutes(controllers.posts, authenticate, optional));
  router.get("/favorites", authenticate, controllers.posts.favorites);
  router.put("/favorites/:post_id", authenticate, controllers.posts.addFavorite);
  router.delete("/favorites/:post_id", authenticate, controllers.posts.removeFavorite);
  router.use(
    "/categories",
    categoriesRoutes(controllers.categories, authenticate, optional, admin),
  );
  router.use("/comments", commentsRoutes(controllers.comments, authenticate, optional, admin));

  return router;
};
