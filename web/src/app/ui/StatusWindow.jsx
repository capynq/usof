import styles from "./AuthGateStatus.module.css";
import { WindowShell } from "../../shared/ui/window-shell/index.js";

export const StatusWindow = ({ status, children }) => {
  const { title, message, ariaLive, labelledBy, role } = status;

  return (
    <WindowShell
      className={styles.window}
      bodyClassName=""
      aria-live={ariaLive}
      aria-labelledby={labelledBy}
      title={title}
      titleId={labelledBy}
    >
      <p role={role}>{message}</p>
      {children}
    </WindowShell>
  );
};
