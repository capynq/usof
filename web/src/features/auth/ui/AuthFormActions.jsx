import styles from "./AuthForm.module.css";

const NOTE_CLASSES = {
  note: styles.note,
  pending: styles.pendingText,
};

export const AuthFormActions = ({
  isLoading,
  label,
  loadingLabel,
  note,
  noteType = "note",
  variant = "primary",
}) => (
  variant === "secondary" ? (
    <button className={styles.secondaryButton} type="submit" disabled={isLoading}>
      {isLoading ? loadingLabel : label}
    </button>
  ) : (
    <div className={styles.actions}>
      <button className={styles.primaryButton} type="submit" disabled={isLoading}>
        {isLoading ? loadingLabel : label}
      </button>
      {note && <span className={NOTE_CLASSES[noteType] ?? NOTE_CLASSES.note}>{note}</span>}
    </div>
  )
);
