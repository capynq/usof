export const toSearchParams = (options) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
  }
  return params.toString();
};

export const parsePositivePage = (value) => Math.max(1, Number.parseInt(value || "1", 10) || 1);

export const withPageParam = (currentParams, page) => {
  const next = new URLSearchParams(currentParams);
  if (page === 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  return next;
};
