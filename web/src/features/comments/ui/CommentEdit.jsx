import { useState } from "react";
import { useUpdateCommentMutation } from "../../../entities/comment/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import itemStyles from "./CommentItem.module.css";
import formStyles from "./CommentForm.module.css";

export const CommentEdit = ({ comment, postId }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateComment, { isLoading }] = useUpdateCommentMutation();

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await updateComment({ commentId: comment.id, postId, content: content.trim() }).unwrap();
      setEditing(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Comment could not be updated."));
    }
  };

  if (!editing) {
    return (
      <>
        <p className={itemStyles.content}>{comment.content}</p>
        <button className={`button ${itemStyles.actionButton}`} type="button" onClick={() => {
          setContent(comment.content);
          setErrorMessage(null);
          setEditing(true);
        }}>Edit</button>
      </>
    );
  }

  return (
    <form className={formStyles.form} onSubmit={submit}>
      <label className={formStyles.label}>
        <span>Edit comment</span>
        <textarea required maxLength={10000} rows={4} value={content} disabled={isLoading} onChange={(event) => setContent(event.currentTarget.value)} />
      </label>
      {errorMessage && <p className={formStyles.error} role="alert">{errorMessage}</p>}
      <div>
        <button className={`button ${formStyles.submit}`} type="submit" disabled={isLoading || !content.trim()}>{isLoading ? "Saving…" : "Save"}</button>{" "}
        <button className="button" type="button" disabled={isLoading} onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </form>
  );
};
