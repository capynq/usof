import styles from "./HelpMascot.module.css";

export const HelpMascotTip = ({ tip }) => (
  <div className={styles.bubble} aria-live="polite">{tip}</div>
);
