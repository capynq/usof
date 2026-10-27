import styles from "./SelectControl.module.css";

export const SelectControl = ({ children, ...props }) => (
  <span className={styles.selectControl}>
    <select {...props}>{children}</select>
    <span className={styles.selectArrow} aria-hidden="true">
      <span />
    </span>
  </span>
);
