import { Link } from "react-router";
import { useSelector } from "react-redux";
import { buildCommentTree, useGetPostCommentsQuery } from "../../../entities/comment/index.js";
import { selectCurrentUser } from "../../auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { CommentForm } from "./CommentForm.jsx";
import { CommentItem } from "./CommentItem.jsx";
import styles from "./CommentDiscussion.module.css";

export const CommentDiscussion = ({ postId, postStatus }) => {
  const currentUser = useSelector(selectCurrentUser);
  const { data: comments, error, isLoading } = useGetPostCommentsQuery(postId);
  const canReply = postStatus === "active" || currentUser?.role === "admin";
  const commentTree = buildCommentTree(comments);

  return (
    <section className={styles.discussion} aria-labelledby="discussion-title">
      <div className={styles.heading}>
        <h2 id="discussion-title">Discussion</h2>
        <span>{comments?.length ?? 0} comments</span>
      </div>
      {canReply && currentUser && <CommentForm postId={postId} />}
      {canReply && !currentUser && (
        <p className={styles.signInPrompt}><Link to="/login">Sign in</Link> to join the discussion.</p>
      )}
      {!canReply && <p className={styles.signInPrompt}>This question is inactive, so new replies are closed.</p>}
      {isLoading && <p className={styles.state}>Loading discussion…</p>}
      {!isLoading && error && (
        <p className={styles.error} role="alert">{getErrorMessage(error, "The discussion could not be loaded.")}</p>
      )}
      {!isLoading && !error && commentTree.length === 0 && (
        <p className={styles.state}>No comments yet. Add the first reply.</p>
      )}
      {!isLoading && !error && commentTree.length > 0 && (
        <ol className={styles.list}>
          {commentTree.map((comment) => (
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
      )}
    </section>
  );
};
