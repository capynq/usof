import { ERROR_CODES } from "../constants/errorCodes.js";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { AppError } from "../errors/AppError.js";
import { AVATAR_PATH_PATTERN } from "../constants/regex.js";

export const storageDirectory = fileURLToPath(new URL("../../storage/", import.meta.url));
export const avatarDirectory = join(storageDirectory, "avatars");

export const saveAvatar = async (file) => {
  if (!file) throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, "An avatar file is required");
  const bytes = file.buffer;
  const valid = {
    "image/png":
      bytes.length >= 24 &&
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
      bytes.toString("ascii", 12, 16) === "IHDR",
    "image/jpeg":
      bytes.length >= 4 &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255 &&
      bytes.at(-2) === 255 &&
      bytes.at(-1) === 217,
    "image/webp":
      bytes.length >= 16 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP",
  };
  if (!valid[file.mimetype])
    throw new AppError(
      400,
      ERROR_CODES.VALIDATION_ERROR,
      "Avatar content does not match an allowed image type",
    );
  const extensions = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
  };
  const name = `${randomUUID()}.${extensions[file.mimetype]}`;
  await mkdir(avatarDirectory, { recursive: true });
  await writeFile(join(avatarDirectory, name), bytes, {
    flag: "wx",
    mode: 0o600,
  });

  return `/avatars/${name}`;
};

export const deleteAvatar = async (relativePath) => {
  if (!relativePath || !AVATAR_PATH_PATTERN.test(relativePath)) return;

  try {
    await unlink(join(avatarDirectory, relativePath.slice("/avatars/".length)));
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Avatar cleanup failed");
  }
};
