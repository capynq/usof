import express from "express";
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Category } from "./models/Category.js";
import { Comment } from "./models/Comment.js";
import { Like } from "./models/Like.js";
import { authController } from "./controllers/auth.controller.js";
import { usersController } from "./controllers/users.controller.js";
import { postsController } from "./controllers/posts.controller.js";
import { categoriesController } from "./controllers/categories.controller.js";
import { commentsController } from "./controllers/comments.controller.js";
import { authenticate } from "./middleware/authenticate.js";
import { optionalAuthenticate } from "./middleware/optionalAuthenticate.js";
import { authorizeRole } from "./middleware/authorizeRole.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createMailer } from "./utils/mailer.js";
import { avatarDirectory } from "./utils/files.js";
import { apiRoutes } from "./routes/index.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { createServices } from "./services/index.js";

export const createApp = async (config, database) => {
  const app = express();
  const users = new User(database);
  const posts = new Post(database);
  const categories = new Category(database);
  const comments = new Comment(database);
  const likes = new Like(database);
  const mailer = createMailer(config);
  const services = createServices(
    { users, posts, categories, comments, likes },
    mailer,
    config,
  );
  const controllers = {
    auth: authController(services.auth, config),
    users: usersController(services.users),
    posts: postsController(services.posts),
    categories: categoriesController(services.categories),
    comments: commentsController(services.comments),
  };
  app.disable("x-powered-by");
  app.use((request, response, next) => {
    response.set("X-Content-Type-Options", "nosniff");
    response.set("Referrer-Policy", "no-referrer");
    response.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    );
    response.set("Cache-Control", "no-store");
    next();
  });
  app.use("/admin", await adminRoutes(services, users, config));
  app.use(express.json({ limit: "256kb" }));
  app.use(
    "/api",
    apiRoutes(
      controllers,
      authenticate(users, config.authSecret),
      optionalAuthenticate(users, config.authSecret),
      authorizeRole("admin"),
    ),
  );
  app.use(
    "/avatars",
    express.static(avatarDirectory, {
      dotfiles: "deny",
      index: false,
      fallthrough: false,
    }),
  );
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
