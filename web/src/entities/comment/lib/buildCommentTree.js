export const buildCommentTree = (comments = []) => {
  const nodes = new Map();

  for (const comment of comments) {
    nodes.set(Number(comment.id), { ...comment, replies: [] });
  }

  const roots = [];

  for (const comment of nodes.values()) {
    const parent = comment.parent_id === null ? null : nodes.get(Number(comment.parent_id));

    if (parent && Number(parent.id) !== Number(comment.id)) {
      parent.replies.push(comment);
      continue;
    }

    roots.push(comment);
  }

  return roots;
};
