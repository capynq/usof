import {
  DATE_TIMEZONE_SUFFIX_PATTERN,
  MYSQL_DATETIME_SPACE_SEPARATOR_PATTERN,
} from "../regexPatterns.js";

const normalizeDateValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  let normalized = value.replace(MYSQL_DATETIME_SPACE_SEPARATOR_PATTERN, "$1T");
  const hasTime = normalized.includes("T");
  const hasTimezone = DATE_TIMEZONE_SUFFIX_PATTERN.test(normalized);

  if (hasTime && !hasTimezone) {
    normalized = `${normalized}Z`;
  }

  return normalized;
};

export const formatDate = (value, formatter, fallback = "Date unavailable") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(normalizeDateValue(value));
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return formatter.format(date);
};
