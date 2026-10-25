import styles from "./PostFeed.module.css";

export const FilterSelect = ({ children, ...props }) => (
  <span className={styles.selectControl}>
    <select {...props}>{children}</select>
    <span className={styles.selectArrow} aria-hidden="true">
      <span />
    </span>
  </span>
);
