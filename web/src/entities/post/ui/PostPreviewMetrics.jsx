import styles from "./PostPreview.module.css";

export const PostPreviewMetrics = ({ likes, replies }) => (
  <span className={styles.metrics} aria-label="Post activity">
    <span>{likes} likes</span>
    <span>{replies} replies</span>
  </span>
);
