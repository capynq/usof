import { useNavigate } from "react-router";
import { useDeletePostMutation } from "../../../entities/post/index.js";
import { useConfirmMutation } from "../../../shared/lib/useConfirmMutation.js";
import { ConfirmDialog } from "../../../shared/ui/confirm-dialog/index.js";
import styles from "./DeletePostButton.module.css";

export const DeletePostButton = ({ postId }) => {
  const navigate = useNavigate();
  const [deletePost, { isLoading }] = useDeletePostMutation();
  const deletion = useConfirmMutation({
    mutate: deletePost,
    onSuccess: () => navigate("/"),
    fallbackMessage: "The question could not be removed.",
    closeOnError: true,
  });

  return (
    <div className={styles.action}>
      <button
        className={`button ${styles.button}`}
        type="button"
        onClick={() => deletion.setIsConfirming(true)}
      >
        Delete question
      </button>
      {deletion.errorMessage && (
        <p className={styles.error} role="alert">
          {deletion.errorMessage}
        </p>
      )}
      {deletion.isConfirming && (
        <ConfirmDialog
          open={deletion.isConfirming}
          title="Delete question?"
          message="This permanently removes the question and its discussion. This action cannot be undone."
          confirmLabel={isLoading ? "Deleting…" : "Delete question"}
          confirmDisabled={isLoading}
          onCancel={() => deletion.setIsConfirming(false)}
          onConfirm={() => deletion.run(postId)}
        />
      )}
    </div>
  );
};
