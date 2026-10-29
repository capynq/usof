import { createAuthService } from "./auth.service.js";
import { createUsersService } from "./users.service.js";
import { createPostsService } from "./posts.service.js";
import { createCategoriesService } from "./categories.service.js";
import { createCommentsService } from "./comments.service.js";
import { createReactionsService } from "./reactions.service.js";

export const createServices = ({ users, posts, categories, comments, likes }, mailer, config) => {
  const reactions = createReactionsService(likes);

  return {
    auth: createAuthService(users, mailer, config),
    users: createUsersService(users, mailer),
    posts: createPostsService(posts, comments, reactions),
    categories: createCategoriesService(categories, posts),
    comments: createCommentsService(comments, reactions),
    reactions,
  };
};

export {
  createAuthService,
  createUsersService,
  createPostsService,
  createCategoriesService,
  createCommentsService,
  createReactionsService,
};
