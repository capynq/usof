import { getCommentCapabilities } from "../model/getCommentCapabilities.js";
import { CommentActions } from "./CommentActions.jsx";
import { CommentHeader } from "./CommentHeader.jsx";
import styles from "./CommentItem.module.css";

export const CommentBody = ({
  comment,
  postId,
  postStatus,
  canReply,
  currentUser,
}) => {
  const isUnavailable = comment.is_deleted || comment.is_context_placeholder;
  const capabilities = getCommentCapabilities(comment, {
    postStatus,
    canReply,
    currentUser,
  });
  const label = `Comment by ${comment.author?.login || "user"}`;
  const contentClassName = isUnavailable ? styles.removed : styles.content;
  return (
    <article className={styles.comment} aria-label={label}>
      <CommentHeader comment={comment} />
      <p className={contentClassName}>{comment.content}</p>
      {!isUnavailable && (
        <CommentActions
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          capabilities={capabilities}
        />
      )}
    </article>
  );
};
