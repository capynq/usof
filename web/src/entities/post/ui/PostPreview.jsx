import { getPostPreviewViewModel } from "../lib/getPostPreviewViewModel.js";
import { PostPreviewBody } from "./PostPreviewBody.jsx";
import { PostPreviewSidebar } from "./PostPreviewSidebar.jsx";
import styles from "./PostPreview.module.css";

export const PostPreview = ({ post, actions }) => {
  const preview = getPostPreviewViewModel(post);

  return (
    <article className={styles.preview}>
      <PostPreviewSidebar
        post={post}
        likes={preview.likes}
        replies={preview.replies}
      />
      <PostPreviewBody
        post={post}
        excerpt={preview.excerpt}
        actions={actions}
      />
    </article>
  );
};
