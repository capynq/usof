import { useState } from "react";
import { useUpdateCommentMutation } from "../../../entities/comment/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "./CommentItem.module.css";

export const CommentStatusAction = ({ comment, postId }) => {
  const [updateComment, { isLoading }] = useUpdateCommentMutation();
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleStatus = async () => {
    setErrorMessage(null);
    try {
      await updateComment({
        commentId: comment.id,
        postId,
        status: comment.status === "active" ? "inactive" : "active",
      }).unwrap();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Comment status could not be changed."));
    }
  };

  return (
    <>
      <button className={`button ${styles.actionButton}`} type="button" disabled={isLoading} onClick={toggleStatus}>
        {comment.status === "active" ? "Hide comment" : "Restore comment"}
      </button>
      {errorMessage && <p className={`${styles.error} ${styles.actionError}`} role="alert">{errorMessage}</p>}
    </>
  );
};
