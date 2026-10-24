import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import styles from "./AuthWindow.module.css";

export const AuthWindow = ({ title, Icon, children, className = "" }) => {
  return (
    <WindowShell
      title={title}
      titleIcon={<Icon className={styles.titleIcon} />}
      titleClassName={styles.titleText}
      className={`${styles.window} ${className}`}
      bodyClassName={styles.body}
    >
      {children}
    </WindowShell>
  );
};
