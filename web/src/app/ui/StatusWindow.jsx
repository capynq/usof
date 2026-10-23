import styles from "./AuthGateStatus.module.css";

export const StatusWindow = ({ status, children }) => {
  const { title, message, ariaLive, labelledBy, role } = status;

  return (
    <section
      className={`window ${styles.window}`}
      aria-live={ariaLive}
      aria-labelledby={labelledBy}
    >
      <div className="title-bar">
        <div className="title-bar-text" id={labelledBy}>
          {title}
        </div>
      </div>
      <div className="window-body">
        <p role={role}>{message}</p>
        {children}
      </div>
    </section>
  );
};
