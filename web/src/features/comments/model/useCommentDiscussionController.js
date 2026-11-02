import { useMemo } from "react";
import { useSelector } from "react-redux";
import { buildCommentTree, useGetPostCommentsQuery } from "../../../entities/comment/index.js";
import { selectCurrentUser } from "../../auth/index.js";
import { POLLING_INTERVALS, livePollingOptions } from "../../../shared/config.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";

export const useCommentDiscussionController = ({ postId, postStatus, skip = false }) => {
  const currentUser = useSelector(selectCurrentUser);
  const query = useGetPostCommentsQuery(postId, {
    skip,
    ...livePollingOptions(POLLING_INTERVALS.comments),
  });
  const staged = useStagedCollection(query.currentData, `comments:${postId}`);
  const canReply = postStatus === "active" || currentUser?.role === "admin";
  const commentTree = useMemo(() => buildCommentTree(staged.data), [staged.data]);

  return {
    currentUser,
    comments: staged.data,
    error: query.error,
    isLoading: query.isLoading,
    canReply,
    commentTree,
    isFetching: query.isFetching,
    pendingCount: staged.pendingCount,
    applyPending: staged.applyPending,
  };
};
