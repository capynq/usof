import styles from "./HelpMascot.module.css";

export const HelpMascotRestoreButton = ({ onRestore }) => (
  <button className={styles.restoreButton} type="button" onClick={onRestore}>
    Bring Clip back
  </button>
);
