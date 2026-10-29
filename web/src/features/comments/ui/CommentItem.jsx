import { CommentBody } from "./CommentBody.jsx";
import styles from "./CommentItem.module.css";

export const CommentItem = ({ comment, postId, postStatus, canReply, currentUser, depth = 0 }) => {
  const replyDepth = Math.min(depth + 1, 4);
  const replyLabel = `Replies to ${comment.author?.login || "comment"}`;

  return (
    <li className={styles.item} id={`comment-${comment.id}`} tabIndex={-1}>
      <CommentBody
        comment={comment}
        postId={postId}
        postStatus={postStatus}
        canReply={canReply}
        currentUser={currentUser}
      />
      {comment.replies.length > 0 && (
        <ol className={styles.replies} data-depth={replyDepth} aria-label={replyLabel}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postStatus={postStatus}
              canReply={canReply}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </ol>
      )}
    </li>
  );
};
