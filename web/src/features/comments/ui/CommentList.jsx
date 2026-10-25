import { CommentItem } from "./CommentItem.jsx";
import styles from "./CommentDiscussion.module.css";

export const CommentList = ({ comments, postId, postStatus, canReply, currentUser }) => (
  <ol className={styles.list}>
    {comments.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        postId={postId}
        postStatus={postStatus}
        canReply={canReply}
        currentUser={currentUser}
      />
    ))}
  </ol>
);
