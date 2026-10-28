import { ERROR_CODES } from "../constants/errorCodes.js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "../errors/AppError.js";
import { MILLISECONDS_PER_SECOND } from "../constants/dates.js";
import { AUTH_SESSION_SECONDS } from "../constants/auth.js";
import {
  AUTH_TOKEN_SIGNATURE_PATTERN,
  URL_SAFE_CHARACTERS_PATTERN,
} from "../constants/regex.js";

export const signAuthToken = (user, secret) => {
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
  const payload = Buffer.from(
    JSON.stringify({
      uid: user.id,
      version: user.auth_version,
      iat: now,
      exp: now + AUTH_SESSION_SECONDS,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
};

export const verifyAuthToken = (token, secret) => {
  const fail = () => {
    throw new AppError(
      401,
      ERROR_CODES.UNAUTHENTICATED,
      "Invalid or expired bearer token",
    );
  };
  if (typeof token !== "string" || token.length > 1024) return fail();
  const parts = token.split(".");
  if (
    parts.length !== 2 ||
    !URL_SAFE_CHARACTERS_PATTERN.test(parts[0]) ||
    !AUTH_TOKEN_SIGNATURE_PATTERN.test(parts[1])
  )
    return fail();
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const signature = Buffer.from(parts[1], "base64url");
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(expected, signature)
  )
    return fail();
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[0], "base64url").toString());
  } catch {
    return fail();
  }
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
  if (
    !Number.isSafeInteger(payload.uid) ||
    payload.uid < 1 ||
    !Number.isSafeInteger(payload.version) ||
    payload.version < 0 ||
    !Number.isSafeInteger(payload.iat) ||
    !Number.isSafeInteger(payload.exp) ||
    payload.iat > now ||
    payload.exp <= now ||
    payload.exp <= payload.iat ||
    payload.exp - payload.iat > AUTH_SESSION_SECONDS
  )
    return fail();
  return payload;
};
