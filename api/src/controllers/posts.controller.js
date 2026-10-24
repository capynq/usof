export const postsController = (posts) => {
  return {
    list: async (request, response) =>
      response.json(await posts.list(request.query, request.user)),
    favorites: async (request, response) =>
      response.json(await posts.favorites(request.query, request.user)),
    get: async (request, response) =>
      response.json({
        data: await posts.get(request.params.post_id, request.user),
      }),
    categories: async (request, response) =>
      response.json({
        data: await posts.categories(request.params.post_id, request.user),
      }),
    comments: async (request, response) =>
      response.json({
        data: await posts.comments(request.params.post_id, request.user),
      }),
    createComment: async (request, response) =>
      response.status(201).json({
        data: await posts.createComment(
          request.params.post_id,
          request.body,
          request.user,
        ),
      }),
    create: async (request, response) =>
      response
        .status(201)
        .json({ data: await posts.create(request.body, request.user) }),
    update: async (request, response) =>
      response.json({
        data: await posts.update(
          request.params.post_id,
          request.body,
          request.user,
        ),
      }),
    delete: async (request, response) => {
      await posts.delete(request.params.post_id, request.user);
      response.status(204).end();
    },
    addFavorite: async (request, response) => {
      await posts.addFavorite(request.params.post_id, request.user);
      response.status(204).end();
    },
    removeFavorite: async (request, response) => {
      await posts.removeFavorite(request.params.post_id, request.user);
      response.status(204).end();
    },
    likes: async (request, response) =>
      response.json({
        data: await posts.likes(request.params.post_id, request.user),
      }),
    createLike: async (request, response) =>
      response.status(201).json({
        data: await posts.createLike(
          request.params.post_id,
          request.body,
          request.user,
        ),
      }),
    deleteLike: async (request, response) => {
      await posts.deleteLike(
        request.params.post_id,
        request.query,
        request.user,
      );
      response.status(204).end();
    },
  };
};
