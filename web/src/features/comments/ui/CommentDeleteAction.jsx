import { useDeleteCommentMutation } from "../../../entities/comment/index.js";
import { useConfirmMutation } from "../../../shared/lib/useConfirmMutation.js";
import { ConfirmDialog } from "../../../shared/ui/confirm-dialog/index.js";
import styles from "./CommentItem.module.css";

export const CommentDeleteAction = ({ comment, postId }) => {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();
  const deletion = useConfirmMutation({
    mutate: deleteComment,
    fallbackMessage: "This comment could not be removed.",
  });

  const startConfirmation = () => {
    deletion.setErrorMessage(null);
    deletion.setIsConfirming(true);
  };

  return (
    <>
      <button className={`button ${styles.actionButton}`} type="button" onClick={startConfirmation}>Remove</button>
      {deletion.errorMessage && <p className={`${styles.error} ${styles.actionError}`} role="alert">{deletion.errorMessage}</p>}
      {deletion.isConfirming && (
        <ConfirmDialog
          open={deletion.isConfirming}
          title="Remove comment?"
          message="The comment will be removed. Replies will remain in the discussion."
          confirmLabel={isLoading ? "Removing…" : "Remove comment"}
          confirmDisabled={isLoading}
          onCancel={() => deletion.setIsConfirming(false)}
          onConfirm={() => deletion.run({ commentId: comment.id, postId })}
        />
      )}
    </>
  );
};
