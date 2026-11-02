import { Link } from "react-router";
import { AuthorLink } from "../../../entities/user/index.js";
import { formatPostDate } from "../../../entities/post/index.js";
import { StatusBadge } from "../../../shared/ui/status-badge/StatusBadge.jsx";
import styles from "./CommentItem.module.css";

export const CommentHeader = ({ comment }) => (
  <header className={styles.header}>
    <span className={styles.author}>
      <AuthorLink user={comment.author} />
    </span>
    <Link className={styles.permalink} to={`/comments/${comment.id}`} aria-label={`Permalink to comment ${comment.id}`}>
      <time dateTime={comment.publish_date}>{formatPostDate(comment.publish_date)}</time>
    </Link>
    {comment.status !== "active" && <StatusBadge status="inactive" />}
    {comment.is_deleted && <StatusBadge status="removed" />}
  </header>
);
