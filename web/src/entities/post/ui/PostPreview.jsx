import { getPostPreviewViewModel } from "../lib/getPostPreviewViewModel.js";
import { PostPreviewBody } from "./PostPreviewBody.jsx";
import { PostPreviewMetrics } from "./PostPreviewMetrics.jsx";
import styles from "./PostPreview.module.css";

export const PostPreview = ({ post }) => {
  const preview = getPostPreviewViewModel(post);

  return (
    <article className={styles.preview}>
      <PostPreviewMetrics likes={preview.likes} replies={preview.replies} />
      <PostPreviewBody post={post} excerpt={preview.excerpt} />
    </article>
  );
};
