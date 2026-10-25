import styles from "./HelpMascot.module.css";

export const HelpMascotActions = ({ onAnotherTip, onHide }) => (
  <div className={styles.actions}>
    <button type="button" onClick={onAnotherTip}>Another tip</button>
    <button className={styles.hideButton} type="button" onClick={onHide}>
      Hide Clip
    </button>
  </div>
);
