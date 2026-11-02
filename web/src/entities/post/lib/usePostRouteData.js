import { useParams } from "react-router";
import { POLLING_INTERVALS, livePollingOptions } from "../../../shared/config.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";
import { useGetPostQuery } from "../api/postApi.js";

const visiblePost = (post) =>
  post && {
    title: post.title,
    content: post.content,
    status: post.status,
    publish_date: post.publish_date,
    updated_at: post.updated_at,
    author: post.author && {
      id: post.author.id,
      login: post.author.login,
      full_name: post.author.full_name,
      profile_picture: post.author.profile_picture,
    },
    categories: post.categories?.map(({ id, title }) => ({ id, title })),
    like_count: post.like_count,
    dislike_count: post.dislike_count,
    viewer_reaction: post.viewer_reaction,
    is_favorite: post.is_favorite,
  };

export const usePostRouteData = ({ poll = true } = {}) => {
  const { postId: rawPostId } = useParams();
  const postId = Number(rawPostId);
  const isValidPostId = Number.isInteger(postId) && postId > 0;
  const query = useGetPostQuery(postId, {
    skip: !isValidPostId,
    ...(poll ? livePollingOptions(POLLING_INTERVALS.postDetails) : {}),
  });
  const staged = useStagedCollection(query.currentData, `post:${postId}`, visiblePost);

  return {
    ...query,
    postId,
    isValidPostId,
    data: poll ? staged.data : query.currentData,
    pendingCount: poll ? staged.pendingCount : 0,
    applyPending: staged.applyPending,
  };
};
