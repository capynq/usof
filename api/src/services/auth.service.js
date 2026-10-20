import { signAuthToken } from "../utils/authToken.js";
import { parse } from "../schemas/parse.js";
import {
  credentials,
  emailRequest,
  registration,
  resetPassword,
  confirmToken,
} from "../schemas/index.js";
import { SECONDS_PER_HOUR } from "../constants/dates.js";

export function createAuthService(users, mailer, config) {
  const send = async (method, body, kind) => {
    const input = parse(emailRequest, body, "email");
    const result = await users[method](input.email);
    if (!result) return null;
    return {
      delivery: await mailer(result.user.email, kind, result.token),
      user: result.user,
    };
  };
  return {
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
      };
    },
    login: async (body) => {
      const user = await users.login(parse(credentials, body, "credentials"));
      return {
        token: signAuthToken(user, config.authSecret),
        user: await users.get(user.id, user),
        expires_in: SECONDS_PER_HOUR,
        token_type: "Bearer",
      };
    },
    logout: (actor) => users.logout(actor?.id),
    confirm: async (rawToken) =>
      users.confirm(parse(confirmToken, rawToken, "confirm_token")),
    requestConfirmation: (body) =>
      send("requestConfirmation", body, "confirmation"),
    requestReset: (body) => send("requestReset", body, "password reset"),
    reset: async (rawToken, body) => {
      const token = parse(confirmToken, rawToken, "confirm_token");
      const input = parse(resetPassword, body, "reset password");
      return users.reset(token, input.new_password);
    },
  };
}
