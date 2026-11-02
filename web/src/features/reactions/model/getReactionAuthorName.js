export const getReactionAuthorName = (row) => row.author?.full_name || row.author?.login || `Member ${row.author_id}`;
