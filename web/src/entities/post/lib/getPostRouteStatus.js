export const getPostRouteStatus = ({ isValidPostId, isLoading, error, post }) => {
  if (!isValidPostId) return "invalid";
  if (isLoading) return "loading";
  if (error || !post) return "unavailable";

  return "ready";
};

export const getPostPermissions = (post, currentUser) => {
  const isOwner = Number(currentUser?.id) === Number(post.author_id);
  const isAdmin = currentUser?.role === "admin";

  return {
    isOwner,
    isAdmin,
    canManage: isOwner || isAdmin,
    canReact: post.status === "active" || isAdmin,
  };
};
