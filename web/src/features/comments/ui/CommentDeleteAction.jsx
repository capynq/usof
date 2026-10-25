import { useDeleteCommentMutation } from "../../../entities/comment/index.js";
import { useConfirmMutation } from "../../../shared/lib/useConfirmMutation.js";
import { ConfirmDialog } from "../../../shared/ui/confirm-dialog/index.js";
import styles from "./CommentItem.module.css";

export const CommentDeleteAction = ({ comment, postId }) => {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();
  const confirmation = useConfirmMutation({
    mutate: deleteComment,
    fallbackMessage: "This comment could not be removed.",
  });

  const openConfirmation = () => {
    confirmation.setErrorMessage(null);
    confirmation.setIsConfirming(true);
  };

  return (
    <>
      <button className={`button ${styles.actionButton}`} type="button" onClick={openConfirmation}>
        Remove
      </button>
      {confirmation.errorMessage && (
        <p className={`${styles.error} ${styles.actionError}`} role="alert">
          {confirmation.errorMessage}
        </p>
      )}
      {confirmation.isConfirming && (
        <ConfirmDialog
          open={confirmation.isConfirming}
          title="Remove comment?"
          message="The comment will be removed. Replies will remain in the discussion."
          confirmLabel={isLoading ? "Removing…" : "Remove comment"}
          confirmDisabled={isLoading}
          onCancel={() => confirmation.setIsConfirming(false)}
          onConfirm={() => confirmation.run({ commentId: comment.id, postId })}
        />
      )}
    </>
  );
};
