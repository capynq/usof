export const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;
export const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const SECURE_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
export const ROLE_PATTERN = /^(user|admin)$/;
export const STATUS_PATTERN = /^(active|inactive)$/;
export const REACTION_TYPE_PATTERN = /^(like|dislike)$/;
export const REACTION_TARGET_PATTERN = /^(post|comment)$/;
export const POST_SORT_PATTERN = /^(likes|date)$/;

export const MIN_DATE = "1000-01-01";
export const MAX_DATE = "9998-12-31";
export const UTC_DAY_START_SUFFIX = "T00:00:00Z";
export const DATE_ONLY_LENGTH = 10;
