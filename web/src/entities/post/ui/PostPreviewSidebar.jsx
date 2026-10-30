import { AuthorLink, UserAvatar } from "../../user/index.js";
import styles from "./PostPreview.module.css";

export const PostPreviewSidebar = ({ post }) => (
  <aside className={styles.sidebar} aria-label="Question author">
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
  </aside>
);
