import { HTTP_STATUS } from "../../../shared/api/index.js";
import { POST_ROUTE_STATUS } from "../model/constants.js";

export const getPostRouteStatus = ({ isValidPostId, isLoading, error, post }) => {
  if (!isValidPostId) return POST_ROUTE_STATUS.invalid;
  if (isLoading) return POST_ROUTE_STATUS.loading;
  if (
    (error && (error.status === HTTP_STATUS.notFound || error.status === HTTP_STATUS.forbidden)) ||
    !post
  ) {
    return POST_ROUTE_STATUS.unavailable;
  }

  return POST_ROUTE_STATUS.ready;
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
