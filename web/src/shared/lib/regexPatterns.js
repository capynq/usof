export const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const URL_SAFE_CHARACTERS_PATTERN = /^[A-Za-z0-9_-]+$/;
export const LOGIN_PATTERN = URL_SAFE_CHARACTERS_PATTERN;

export const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;
export const CATEGORY_ID_PATTERN = POSITIVE_INTEGER_PATTERN;
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const MYSQL_DATETIME_SPACE_SEPARATOR_PATTERN = /^(\d{4}-\d{2}-\d{2}) /;
export const DATE_TIMEZONE_SUFFIX_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i;
