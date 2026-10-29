import { LoadingIndicator } from "../../../shared/ui/loading/index.js";
import { Link } from "react-router";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "./CommentDiscussion.module.css";

export const CommentDiscussionNotices = ({
  canReply,
  currentUser,
  error,
  isLoading,
  completing,
  commentTree,
}) => (
  <>
    {canReply && !currentUser && (
      <p className={styles.signInPrompt}><Link to="/login">Sign in</Link> to join the discussion.</p>
    )}
    {!canReply && <p className={styles.signInPrompt}>This question is inactive, so new replies are closed.</p>}
    {isLoading && <LoadingIndicator completing={completing}>Loading discussion…</LoadingIndicator>}
    {!isLoading && error && (
      <p className={styles.error} role="alert">{getErrorMessage(error, "The discussion could not be loaded.")}</p>
    )}
    {!isLoading && !error && commentTree.length === 0 && (
      <p className={styles.state}>No comments yet. Add the first reply.</p>
    )}
  </>
);
