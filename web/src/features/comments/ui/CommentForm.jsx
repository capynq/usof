import { FormCompanion } from "../../../shared/ui/mascot/FormCompanion.jsx";
import { useCommentForm } from "../model/useCommentForm.js";
import styles from "./CommentForm.module.css";

export const CommentForm = ({
  postId,
  parentId = null,
  parentLabel,
  onCreated,
}) => {
  const form = useCommentForm({ postId, parentId, onCreated });

  return (
    <form className={styles.form} onSubmit={form.submit}>
      {parentId === null && <FormCompanion context="writing" />}
      {parentLabel && (
        <p className={styles.replyContext}>Replying to {parentLabel}</p>
      )}
      <label className={styles.label}>
        <span>
          {parentId === null ? "Add to the discussion" : "Your reply"}
        </span>
        <textarea
          maxLength={10000}
          required
          rows={4}
          value={form.content}
          onChange={(event) => form.setContent(event.currentTarget.value)}
        />
      </label>
      {form.errorMessage && (
        <p className={styles.error} role="alert">
          {form.errorMessage}
        </p>
      )}
      <button
        className={`button ${styles.submit}`}
        type="submit"
        disabled={form.isLoading || !form.content.trim()}
      >
        {form.isLoading
          ? "Posting…"
          : parentId === null
            ? "Post comment"
            : "Post reply"}
      </button>
    </form>
  );
};
