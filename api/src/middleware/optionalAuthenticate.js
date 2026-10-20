import { authenticate } from "./authenticate.js";

export const optionalAuthenticate = (users, secret) =>
  authenticate(users, secret, true);
