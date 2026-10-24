export const normalizePaginationQuery = (query) => {
  const normalized = { ...(query ?? {}) };
  for (const key of ["page", "page_size"]) {
    if (typeof normalized[key] === "number") {
      normalized[key] = String(normalized[key]);
    }
  }
  return normalized;
};
