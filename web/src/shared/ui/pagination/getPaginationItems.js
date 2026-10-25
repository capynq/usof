export const getPaginationItems = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const orderedPages = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right);

  return orderedPages.flatMap((value, index) => {
    const previous = orderedPages[index - 1];
    if (!previous || value - previous === 1) return [value];
    return value - previous === 2
      ? [previous + 1, value]
      : [`ellipsis-${value}`, value];
  });
};
