import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { PASSWORD_SALT_PATTERN, PASSWORD_HASH_PATTERN } from "../constants/regex.js";

const derive = promisify(scrypt);

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await derive(password, salt, 64, { N: 16384, r: 8, p: 1 });

  return `scrypt$16384$8$1$${salt}$${hash.toString("hex")}`;
};

export const verifyPassword = async (password, encoded) => {
  const parts = encoded.split("$");

  if (
    parts.length !== 6 ||
    parts.slice(0, 4).join("$") !== "scrypt$16384$8$1" ||
    !PASSWORD_SALT_PATTERN.test(parts[4]) ||
    !PASSWORD_HASH_PATTERN.test(parts[5])
  ) {
    return false;
  }

  const actual = await derive(password, parts[4], 64, { N: 16384, r: 8, p: 1 });

  return timingSafeEqual(actual, Buffer.from(parts[5], "hex"));
};
