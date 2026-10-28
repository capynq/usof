export const getCommentCapabilities = (comment, { postStatus, canReply, currentUser }) => {
  const isAdmin = currentUser?.role === "admin";
  const isOwner = Number(currentUser?.id) === Number(comment.author_id);

  return {
    canReact: isAdmin || (postStatus === "active" && comment.status === "active"),
    canDelete: (isOwner || isAdmin) && !comment.is_deleted,
    canEdit: Boolean(currentUser) && isOwner && !comment.is_deleted,
    canModerate: isAdmin && !comment.is_deleted,
    canReply: canReply &&
      comment.status === "active" &&
      !comment.is_deleted &&
      !comment.is_context_placeholder,
  };
};
