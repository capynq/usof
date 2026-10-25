import { truncateText } from "../../../shared/lib/truncateText.js";

export const getPostPreviewViewModel = (post) => ({
  excerpt: truncateText(post.excerpt ?? post.content ?? "", 260),
  likes: post.like_count ?? 0,
  replies: post.comment_count ?? 0,
});
