import { AuthorLink, UserAvatar } from "../../user/index.js";
import { PostPreviewMetrics } from "./PostPreviewMetrics.jsx";
import styles from "./PostPreview.module.css";

export const PostPreviewSidebar = ({ post, likes, replies }) => (
  <aside className={styles.sidebar} aria-label="Question author and activity">
    <AuthorLink
      user={post.author}
      className={styles.author}
      ariaLabel={`View ${post.author?.full_name || post.author?.login || "author"}'s profile`}
    >
      <UserAvatar user={post.author} />
      <span className={styles.authorName}>
        {post.author?.full_name || post.author?.login || "Author"}
      </span>
    </AuthorLink>
    <PostPreviewMetrics likes={likes} replies={replies} />
  </aside>
);
