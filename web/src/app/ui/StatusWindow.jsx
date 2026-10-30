import { LoadingIndicator } from "../../shared/ui/loading/index.js";
import { StateCompanion } from "../../shared/ui/mascot/StateCompanion.jsx";
import styles from "./AuthGateStatus.module.css";
import { WindowShell } from "../../shared/ui/window-shell/index.js";

export const StatusWindow = ({ status, children, completing }) => {
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
      {role === "alert" ? (
        <StateCompanion kind="error">
          <p role={role}>{message}</p>
        </StateCompanion>
      ) : (
        <LoadingIndicator completing={completing} expanded>{message}</LoadingIndicator>
      )}
      {children}
    </WindowShell>
  );
};
