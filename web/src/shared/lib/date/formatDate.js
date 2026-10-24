const normalizeDateValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  let normalized = value.replace(/^(\d{4}-\d{2}-\d{2}) /, "$1T");
  const hasTime = normalized.includes("T");
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);

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
