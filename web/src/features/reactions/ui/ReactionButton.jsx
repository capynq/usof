import styles from "./ReactionControls.module.css";

export const ReactionButton = ({ label, symbol, count, isSelected, disabled, title, onClick }) => (
  <button
    className={`button ${styles.button} ${isSelected ? styles.selected : ""}`}
    type="button"
    disabled={disabled}
    aria-pressed={isSelected}
    aria-label={`${label}, ${count}`}
    title={title}
    onClick={onClick}
  >
    <span className={styles.symbol} aria-hidden="true">{symbol}</span>
    <span>{label}</span>
    <span className={styles.count}>{count}</span>
  </button>
);
