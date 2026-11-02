import { Link } from "react-router";
import styles from "./CommentItem.module.css";

export const ReplyAction = ({ canReply, currentUser, isReplying, onToggle }) => {
  if (!canReply) return null;
  if (!currentUser) return <Link className={styles.signIn} to="/login">Login to reply</Link>;

  return (
    <button className={`button ${styles.actionButton}`} type="button" onClick={onToggle}>
      {isReplying ? "Close reply" : "Reply"}
    </button>
  );
};
