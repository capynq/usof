export function categoriesController(categories) {
  return {
    list: async (_request, response) =>
      response.json({ data: await categories.list() }),
    get: async (request, response) =>
      response.json({ data: await categories.get(request.params.category_id) }),
    posts: async (request, response) =>
      response.json(
        await categories.posts(
          request.params.category_id,
          request.query,
          request.user,
        ),
      ),
    create: async (request, response) =>
      response
        .status(201)
        .json({ data: await categories.create(request.body) }),
    update: async (request, response) =>
      response.json({
        data: await categories.update(request.params.category_id, request.body),
      }),
    delete: async (request, response) => {
      await categories.delete(request.params.category_id);
      response.status(204).end();
    },
  };
}
