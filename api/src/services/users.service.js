import { deleteAvatar, saveAvatar } from "../utils/files.js";
import { parse } from "../schemas/parse.js";
import { createUser, updateOwnUser, updateUser } from "../schemas/index.js";
import { assertNonEmpty } from "../schemas/parse.js";
import { idInput } from "../schemas/common.js";

export const createUsersService = (users, mailer) => ({
  list: (actor) => users.list(actor),
  get: (rawId, actor) =>
    users.get(parse(idInput, String(rawId), "user_id"), actor),
  getPublic: (rawId) =>
    users.getPublic(parse(idInput, String(rawId), "user_id")),
  create: async (body) => {
    const input = parse(createUser, body, "user");
    const { password_confirmation: ignored, ...modelInput } = input;
    return users.create({ ...modelInput, full_name: input.full_name ?? "" });
  },
  update: async (rawId, body, actor) => {
    const input = assertNonEmpty(
      parse(
        actor?.role === "admin" ? updateUser : updateOwnUser,
        body,
        "user",
      ),
      "At least one profile field is required",
    );
    const result = await users.update(
      parse(idInput, String(rawId), "user_id"),
      input,
      actor,
    );
    if (result.token && mailer) {
      return {
        user: result.user,
        delivery: await mailer(
          result.user.email,
          "confirmation",
          result.token,
        ),
      };
    }

    return result;
  },
  delete: async (rawId, actor) => {
    const result = await users.delete(
      parse(idInput, String(rawId), "user_id"),
      actor,
    );
    await Promise.all(result.avatarPaths.map(deleteAvatar));
    return result;
  },
  avatar: async (file, actor) => {
    const path = await saveAvatar(file);
    try {
      const result = await users.setAvatar(actor.id, path);
      await deleteAvatar(result.oldPath);
      return result.user;
    } catch (error) {
      await deleteAvatar(path);
      throw error;
    }
  },
});
