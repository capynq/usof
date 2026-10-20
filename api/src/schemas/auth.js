import { strictObject, pipe, forward, partialCheck } from "valibot";
import { email, login, password, token } from "./common.js";

export const registration = pipe(
  strictObject({
    login,
    email,
    password,
    password_confirmation: password,
  }),
  forward(
    partialCheck(
      [["password"], ["password_confirmation"]],
      (input) => input.password === input.password_confirmation,
      "Password confirmation must match",
    ),
    ["password_confirmation"],
  ),
);
export const credentials = strictObject({ login, email, password });
export const emailRequest = strictObject({ email });
export const resetPassword = strictObject({ new_password: password });
export const confirmToken = token;
