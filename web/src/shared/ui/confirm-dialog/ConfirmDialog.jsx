import { useEffect, useId, useRef } from "react";
import styles from "./ConfirmDialog.module.css";

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Continue",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      className={`window ${styles.dialog}`}
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onCancel}
    >
      <div className="title-bar">
        <div className="title-bar-text" id={titleId}>{title}</div>
      </div>
      <div className={`window-body ${styles.body}`}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className="button" type="button" onClick={onCancel}>Cancel</button>
          <button className={`button ${styles.confirm}`} type="button" disabled={confirmDisabled} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
};
