export function commentsController(comments) {
  return {
    list: async (request, response) =>
      response.json({ data: await comments.list(request.user) }),
    get: async (request, response) =>
      response.json({
        data: await comments.get(request.params.comment_id, request.user),
      }),
    update: async (request, response) =>
      response.json({
        data: await comments.update(
          request.params.comment_id,
          request.body,
          request.user,
        ),
      }),
    delete: async (request, response) => {
      await comments.delete(request.params.comment_id, request.user);
      response.status(204).end();
    },
    likes: async (request, response) =>
      response.json({
        data: await comments.likes(request.params.comment_id, request.user),
      }),
    createLike: async (request, response) =>
      response.status(201).json({
        data: await comments.createLike(
          request.params.comment_id,
          request.body,
          request.user,
        ),
      }),
    deleteLike: async (request, response) => {
      await comments.deleteLike(
        request.params.comment_id,
        request.query,
        request.user,
      );
      response.status(204).end();
    },
  };
}
