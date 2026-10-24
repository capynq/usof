import { useState } from "react";
import { useCreateCommentMutation } from "../../../entities/comment/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "./CommentForm.module.css";

export const CommentForm = ({ postId, parentId = null, parentLabel, onCreated }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await createComment({
        postId,
        content: content.trim(),
        ...(parentId === null ? {} : { parent_id: parentId }),
      }).unwrap();
      setContent("");
      onCreated?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Your reply could not be posted."));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {parentLabel && <p className={styles.replyContext}>Replying to {parentLabel}</p>}
      <label className={styles.label}>
        <span>{parentId === null ? "Add to the discussion" : "Your reply"}</span>
        <textarea
          maxLength={10000}
          required
          rows={4}
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
        />
      </label>
      {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
      <button className={`button ${styles.submit}`} type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? "Posting…" : parentId === null ? "Post comment" : "Post reply"}
      </button>
    </form>
  );
};
