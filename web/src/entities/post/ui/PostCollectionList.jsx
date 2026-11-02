import { PostPreview } from "./PostPreview.jsx";
import styles from "./PostCollection.module.css";

export const PostCollectionList = ({ posts, renderActions, className }) => (
  <div className={styles.slot}>
    <div className={className}>
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} actions={renderActions?.(post)} />
      ))}
    </div>
  </div>
);
