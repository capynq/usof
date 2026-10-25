export const DATABASE_NAME_PATTERN = /^usof(?:_[a-z0-9_]+)?$/;
export const DECIMAL_PORT_PATTERN = /^\d+$/;

export const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;
export const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const SECURE_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
export const URL_SAFE_CHARACTERS_PATTERN = /^[A-Za-z0-9_-]+$/;
export const ROLE_PATTERN = /^(user|admin)$/;
export const STATUS_PATTERN = /^(active|inactive)$/;
export const REACTION_TYPE_PATTERN = /^(like|dislike)$/;
export const REACTION_TARGET_PATTERN = /^(post|comment)$/;
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const BOOLEAN_STRING_PATTERN = /^(true|false)$/;
export const POST_SORT_PATTERN = /^(likes|date)$/;

export const AUTH_TOKEN_SIGNATURE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
export const PASSWORD_SALT_PATTERN = /^[a-f0-9]{32}$/;
export const PASSWORD_HASH_PATTERN = /^[a-f0-9]{128}$/;
export const AVATAR_PATH_PATTERN = /^\/avatars\/[a-f0-9-]{36}\.(png|jpg|webp)$/;
export const BEARER_HEADER_PATTERN = /^Bearer [A-Za-z0-9_.-]+$/;
