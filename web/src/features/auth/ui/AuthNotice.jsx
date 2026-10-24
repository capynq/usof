import styles from "./AuthNotice.module.css";
import { AUTH_NOTICE_ROLES } from "./constants.js";

export const AuthNotice = ({ children, type = "info" }) => {
  const noticeType = Object.hasOwn(AUTH_NOTICE_ROLES, type) ? type : "info";

  return (
    <div className={`${styles.notice} ${styles[noticeType]}`} role={AUTH_NOTICE_ROLES[noticeType]}>
      {children}
    </div>
  );
};
