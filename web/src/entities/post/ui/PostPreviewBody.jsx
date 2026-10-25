import { Link } from "react-router";
import { CategoryList } from "../../category/index.js";
import { PostMeta } from "./PostMeta.jsx";
import styles from "./PostPreview.module.css";

export const PostPreviewBody = ({ post, excerpt }) => (
  <div className={styles.body}>
    <h3 className={styles.title}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </h3>
    <p className={styles.excerpt}>{excerpt}</p>
    <PostMeta post={post} className={styles.meta} statusClassName={styles.status} />
    <CategoryList categories={post.categories} className={styles.categories} />
  </div>
);
