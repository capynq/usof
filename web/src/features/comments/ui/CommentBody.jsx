import { AuthorLink } from "../../../entities/user/index.js";
import { formatPostDate } from "../../../entities/post/index.js";
import { getCommentCapabilities } from "../model/getCommentCapabilities.js";
import { CommentActions } from "./CommentActions.jsx";
import styles from "./CommentItem.module.css";

const CommentHeader = ({ comment }) => (
  <header className={styles.header}>
    <span className={styles.author}><AuthorLink user={comment.author} /></span>
    <time dateTime={comment.publish_date}>{formatPostDate(comment.publish_date)}</time>
    {comment.status !== "active" && <span className={styles.status}>Inactive</span>}
    {comment.is_deleted && <span className={styles.status}>Removed</span>}
  </header>
);

const UnavailableCommentBody = ({ comment }) => (
  <>
    <CommentHeader comment={comment} />
    <p className={styles.removed}>{comment.content}</p>
  </>
);

const VisibleCommentBody = ({ comment, postId, capabilities, currentUser }) => (
  <>
    <CommentHeader comment={comment} />
    <p className={styles.content}>{comment.content}</p>
    <CommentActions
      comment={comment}
      postId={postId}
      currentUser={currentUser}
      capabilities={capabilities}
    />
  </>
);

export const CommentBody = ({ comment, postId, postStatus, canReply, currentUser }) => {
  const isUnavailable = comment.is_deleted || comment.is_context_placeholder;
  const capabilities = getCommentCapabilities(comment, { postStatus, canReply, currentUser });

  return (
    <article className={styles.comment} aria-label={`Comment by ${comment.author?.login || "user"}`}>
      {isUnavailable
        ? <UnavailableCommentBody comment={comment} />
        : <VisibleCommentBody comment={comment} postId={postId} capabilities={capabilities} currentUser={currentUser} />}
    </article>
  );
};
