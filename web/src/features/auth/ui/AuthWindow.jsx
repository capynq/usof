import styles from "./AuthWindow.module.css";

export const AuthWindow = ({ title, Icon, children, className = "" }) => {
  return (
    <section className={`window ${styles.window} ${className}`} aria-labelledby="auth-window-title">
      <div className="title-bar">
        <div className={`title-bar-text ${styles.titleText}`} id="auth-window-title">
          <Icon className={styles.titleIcon} />
          {title}
        </div>
      </div>
      <div className={`window-body ${styles.body}`}>{children}</div>
    </section>
  );
};
