import { optional, strictObject, pipe, forward, partialCheck } from "valibot";
import { email, login, password, role, text } from "./common.js";

export const createUser = pipe(
  strictObject({
    login,
    email,
    password,
    password_confirmation: password,
    role,
    full_name: optional(text(0, 120)),
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
export const updateUser = strictObject({
  login: optional(login),
  email: optional(email),
  full_name: optional(text(0, 120)),
  role: optional(role),
});
export const updateOwnUser = strictObject({
  login: optional(login),
  email: optional(email),
  full_name: optional(text(0, 120)),
});
