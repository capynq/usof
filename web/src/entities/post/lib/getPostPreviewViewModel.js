export const getPostPreviewViewModel = (post) => ({
  likes: post.like_count ?? 0,
  replies: post.comment_count ?? 0,
});
