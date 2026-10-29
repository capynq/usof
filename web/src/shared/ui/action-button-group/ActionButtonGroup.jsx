import { Link } from "react-router";
import styles from "./ActionButtonGroup.module.css";

export const ActionButtonGroup = ({ actions, className = "" }) => (
  <div className={`${styles.group} ${className}`}>
    {actions.map(({ id, label, to, onClick, disabled = false, ...props }) =>
      to ? (
        <Link key={id ?? to} className={styles.action} to={to} {...props}>
          {label}
        </Link>
      ) : (
        <button
          key={id ?? label}
          className={styles.action}
          type="button"
          disabled={disabled}
          onClick={() => onClick?.()}
          {...props}
        >
          {label}
        </button>
      ),
    )}
  </div>
);
