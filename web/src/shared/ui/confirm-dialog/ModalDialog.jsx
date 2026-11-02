import { Dialog } from "./Dialog.jsx";

export const ModalDialog = ({
  open,
  title,
  onClose,
  busy = false,
  submitFormId,
  submitLabel,
  submitDisabled = false,
  children,
}) => {
  return (
    <Dialog
      open={open}
      title={title}
      busy={busy}
      onClose={onClose}
      className="window"
      bodyClassName="window-body"
      footer={
        <>
          {submitFormId && (
            <button type="submit" form={submitFormId} disabled={busy || submitDisabled}>
              {submitLabel}
            </button>
          )}
          <button type="button" disabled={busy} onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      {children}
    </Dialog>
  );
};
