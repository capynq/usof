import styles from "./FormField.module.css";

export const FormField = ({
  className = "",
  error,
  hint,
  id,
  inputProps = {},
  label,
  layout = "stacked",
}) => {
  const fieldLayout = layout === "horizontal" ? "horizontal" : "stacked";
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [inputProps["aria-describedby"], hintId, errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${styles.field} ${styles[fieldLayout]} ${className}`}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <input
          {...inputProps}
          id={id}
          aria-invalid={error ? true : inputProps["aria-invalid"] ?? false}
          aria-describedby={describedBy || undefined}
        />
        {hint && <span className={styles.hint} id={hintId}>{hint}</span>}
        {error && <span className={styles.error} id={errorId}>{error}</span>}
      </div>
    </div>
  );
};
