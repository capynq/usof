export const REACTION_PICKER_PAGE_SIZE = 5;

export const filterReactionComments = (comments = [], search = "") => {
  const term = search.trim().toLocaleLowerCase();
  if (!term) return [];

  return comments.filter((comment) =>
    [
      comment.id,
      comment.post_id,
      comment.content,
      comment.author?.login,
      comment.author?.full_name,
      comment.author_id,
    ].some((value) =>
      String(value ?? "")
        .toLocaleLowerCase()
        .includes(term),
    ),
  );
};

export const paginateReactionTargets = (records = [], page = 1) => {
  const totalPages = Math.ceil(records.length / REACTION_PICKER_PAGE_SIZE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * REACTION_PICKER_PAGE_SIZE;

  return {
    page: currentPage,
    totalPages,
    total: records.length,
    records: records.slice(start, start + REACTION_PICKER_PAGE_SIZE),
  };
};

export const getReactionTargetExcerpt = (record, limit = 180) => {
  const content = record?.excerpt ?? record?.content ?? "";

  return content.length > limit ? `${content.slice(0, limit).trimEnd()}…` : content;
};
