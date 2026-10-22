export const authController = (auth, config) => {
  const requestMail = (method) => async (request, response) => {
    await auth[method](request.body);
    response.json({
      data: {
        message:
          config.mailMode === "file"
            ? "If the account is eligible, a link was saved to the private development outbox. No email was sent."
            : "If the account is eligible, a link was submitted for email delivery.",
      },
    });
  };
  return {
    me: async (request, response) =>
      response.json({ data: await auth.me(request.user) }),
    register: async (request, response) =>
      response.status(201).json({ data: await auth.register(request.body) }),
    login: async (request, response) =>
      response.json({ data: await auth.login(request.body) }),
    logout: async (request, response) => {
      await auth.logout(request.user);
      response.status(204).end();
    },
    confirm: async (request, response) => {
      await auth.confirm(request.params.confirm_token);
      response.json({
        data: { message: "Email confirmed. You may now log in." },
      });
    },
    resendConfirmation: requestMail("requestConfirmation"),
    requestReset: requestMail("requestReset"),
    reset: async (request, response) => {
      await auth.reset(request.params.confirm_token, request.body);
      response.json({
        data: {
          message: "Password reset. Previous sessions have been invalidated.",
        },
      });
    },
  };
};
