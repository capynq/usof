import { useEffect, useId, useRef } from "react";
import styles from "./Dialog.module.css";

export const Dialog = ({
  open,
  title,
  busy = false,
  onClose,
  className = "",
  bodyClassName = "",
  descriptionId,
  footer,
  children,
}) => {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    if (open && !dialog.open) {
      previousFocusRef.current = document.activeElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const requestClose = () => {
    if (!busy) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className="title-bar">
        <h2 className="title-bar-text" id={titleId}>
          {title}
        </h2>
      </div>
      <div className={`${styles.body} ${bodyClassName}`.trim()}>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
};
