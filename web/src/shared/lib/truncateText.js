export const truncateText = (text = "", maxLength) => text.length > maxLength
  ? `${text.slice(0, maxLength).trimEnd()}…`
  : text;
