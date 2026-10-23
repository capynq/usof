import styles from "./AuthNotice.module.css";
import { AUTH_NOTICE_ROLES } from "./constants.js";

export const AuthNotice = ({ children, type = "info" }) => {
  return (
    <div className={`${styles.notice} ${styles[type]}`} role={AUTH_NOTICE_ROLES[type]}>
      {children}
    </div>
  );
};
