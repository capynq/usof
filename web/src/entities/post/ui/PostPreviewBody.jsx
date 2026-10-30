import { Link } from "react-router";
import { CategoryList } from "../../category/index.js";
import { PostMeta } from "./PostMeta.jsx";
import { PostPreviewMetrics } from "./PostPreviewMetrics.jsx";
import styles from "./PostPreview.module.css";

export const PostPreviewBody = ({ post, excerpt, likes, replies, actions }) => (
  <div className={styles.body}>
    <div className={styles.heading}>
      <h3 className={styles.title}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      {actions}
    </div>
    <p className={styles.excerpt}>{excerpt}</p>
    <PostMeta
      post={post}
      className={styles.meta}
      showAuthor={false}
      leading={<PostPreviewMetrics likes={likes} replies={replies} />}
      leadingGroupClassName={styles.activityDate}
    />
    <CategoryList categories={post.categories} className={styles.categories} />
  </div>
);
