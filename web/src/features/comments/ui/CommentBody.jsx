import { useRecentlyChanged } from "../../../shared/lib/useRecentlyChanged.js";
import { getCommentCapabilities } from "../model/getCommentCapabilities.js";
import { CommentActions } from "./CommentActions.jsx";
import { CommentHeader } from "./CommentHeader.jsx";
import { CommentEdit } from "./CommentEdit.jsx";
import styles from "./CommentItem.module.css";

export const CommentBody = ({ comment, postId, postStatus, canReply, currentUser }) => {
  const isRefreshed = useRecentlyChanged([
    comment.content,
    comment.status,
    comment.like_count,
    comment.dislike_count,
    comment.updated_at,
  ]);
  const isUnavailable = comment.is_deleted || comment.is_context_placeholder;
  const capabilities = getCommentCapabilities(comment, {
    postStatus,
    canReply,
    currentUser,
  });
  const label = `Comment by ${comment.author?.login || "user"}`;
  const contentClassName = isUnavailable ? styles.removed : styles.content;
  const className = isRefreshed ? `${styles.comment} ${styles.refreshed}` : styles.comment;

  return (
    <article className={className} aria-label={label}>
      <CommentHeader comment={comment} />
      {capabilities.canEdit && !isUnavailable ? (
        <CommentEdit comment={comment} postId={postId} />
      ) : (
        <p className={contentClassName}>{comment.content}</p>
      )}
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
