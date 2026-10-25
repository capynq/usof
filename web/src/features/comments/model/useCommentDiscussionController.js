import { useSelector } from "react-redux";
import { buildCommentTree, useGetPostCommentsQuery } from "../../../entities/comment/index.js";
import { selectCurrentUser } from "../../auth/index.js";

export const useCommentDiscussionController = ({ postId, postStatus }) => {
  const currentUser = useSelector(selectCurrentUser);
  const query = useGetPostCommentsQuery(postId);
  const canReply = postStatus === "active" || currentUser?.role === "admin";

  return {
    currentUser,
    comments: query.data,
    error: query.error,
    isLoading: query.isLoading,
    canReply,
    commentTree: buildCommentTree(query.data),
  };
};
