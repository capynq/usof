import styles from "./AuthField.module.css";

export const AuthField = ({
  autoComplete,
  error,
  label,
  maxLength,
  minLength,
  name,
  onChange,
  type = "text",
  value,
}) => {
  const errorId = `${name}-error`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          {...(Boolean(error) && { "aria-describedby": errorId })}
        />
        {error && <span className={styles.error} id={errorId}>{error}</span>}
      </div>
    </div>
  );
};
