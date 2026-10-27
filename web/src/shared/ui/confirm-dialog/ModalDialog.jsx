import { Dialog } from "./Dialog.jsx";

export const ModalDialog = ({
  open,
  title,
  onClose,
  busy = false,
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
        <button type="button" disabled={busy} onClick={onClose}>
          Close
        </button>
      }
    >
      {children}
    </Dialog>
  );
};
