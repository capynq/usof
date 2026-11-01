import { signAuthToken } from "../utils/authToken.js";
import { confirmationUrl } from "../utils/mailer.js";
import { parse } from "../schemas/parse.js";
import {
  credentials,
  emailRequest,
  registration,
  resetPassword,
  confirmToken,
} from "../schemas/index.js";
import { AUTH_SESSION_SECONDS } from "../constants/auth.js";

export const createAuthService = (users, mailer, config) => {
  const send = async (method, body, kind) => {
    const input = parse(emailRequest, body, "email");
    const result = await users[method](input.email);

    if (!result) {
      return null;
    }

    return {
      delivery: await mailer(result.user.email, kind, result.token),
      user: result.user,
    };
  };

  return {
    me: (user) => users.get(user.id, user),
    register: async (body) => {
      const input = parse(registration, body, "registration");
      const result = await users.register({
        login: input.login,
        email: input.email,
        password: input.password,
      });

      return {
        user: result.user,
        delivery: await mailer(result.user.email, "confirmation", result.token),
        ...(config.development && config.mailMode === "file"
          ? { confirmation_url: confirmationUrl(config, result.token) }
          : {}),
      };
    },
    login: async (body) => {
      const user = await users.login(parse(credentials, body, "credentials"));

      return {
        token: signAuthToken(user, config.authSecret),
        user: await users.get(user.id, user),
        expires_in: AUTH_SESSION_SECONDS,
        token_type: "Bearer",
      };
    },
    logout: (user) => users.logout(user?.id),
    confirm: async (rawToken) => users.confirm(parse(confirmToken, rawToken, "confirm_token")),
    requestConfirmation: (body) => send("requestConfirmation", body, "confirmation"),
    requestReset: (body) => send("requestReset", body, "password reset"),
    reset: async (rawToken, body) => {
      const token = parse(confirmToken, rawToken, "confirm_token");
      const input = parse(resetPassword, body, "reset password");

      return users.reset(token, input.new_password);
    },
  };
};
