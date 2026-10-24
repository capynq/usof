import { Link } from "react-router";
import { CategoryList } from "../../category/index.js";
import { truncateText } from "../../../shared/lib/truncateText.js";
import { PostMeta } from "./PostMeta.jsx";
import styles from "./PostPreview.module.css";

export const PostPreview = ({ post }) => {
  const content = post.excerpt ?? post.content ?? "";
  const excerpt = truncateText(content, 260);

  return (
    <article className={styles.preview}>
      <div className={styles.metrics} aria-label="Post activity">
        <span>{post.like_count ?? 0} likes</span>
        <span>{post.comment_count ?? 0} replies</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <PostMeta post={post} className={styles.meta} statusClassName={styles.status} />
        <CategoryList categories={post.categories} className={styles.categories} />
      </div>
    </article>
  );
};
