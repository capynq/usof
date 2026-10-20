import { createHash, randomBytes } from "node:crypto";
import { MILLISECONDS_PER_HOUR } from "../constants/dates.js";

export function hashSecureToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSecureToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    hash: hashSecureToken(token),
    expiresAt: new Date(Date.now() + MILLISECONDS_PER_HOUR),
  };
}
