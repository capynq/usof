import { useId } from "react";
import styles from "./ConfirmDialog.module.css";
import { Dialog } from "./Dialog.jsx";

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Continue",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  const messageId = useId();

  return (
    <Dialog
      open={open}
      title={title}
      busy={confirmDisabled}
      onClose={onCancel}
      className="window"
      bodyClassName="window-body"
      descriptionId={messageId}
      footer={
        <div className={styles.actions}>
          <button className="button" type="button" disabled={confirmDisabled} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`button ${styles.confirm}`}
            type="button"
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p id={messageId}>{message}</p>
    </Dialog>
  );
};
