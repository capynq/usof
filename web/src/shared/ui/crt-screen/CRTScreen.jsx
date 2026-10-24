import styles from "./CRTScreen.module.css";

export const CRTScreen = ({ children }) => {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>{children}</div>
      <div className={styles.overlay} aria-hidden="true">
        <span className={styles.glass} />
        <span className={styles.scanlines} />
        <span className={styles.shadowMask} />
      </div>
    </div>
  );
};
