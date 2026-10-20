export function usersController(users) {
  return {
    list: async (request, response) =>
      response.json({ data: await users.list(request.user) }),
    get: async (request, response) =>
      response.json({
        data: await users.get(request.params.user_id, request.user),
      }),
    create: async (request, response) =>
      response.status(201).json({ data: await users.create(request.body) }),
    update: async (request, response) =>
      response.json({
        data: await users.update(
          request.params.user_id,
          request.body,
          request.user,
        ),
      }),
    delete: async (request, response) => {
      await users.delete(request.params.user_id, request.user);
      response.status(204).end();
    },
    avatar: async (request, response) =>
      response.json({ data: await users.avatar(request.file, request.user) }),
  };
}
