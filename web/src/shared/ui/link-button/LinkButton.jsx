import { Link } from "react-router";
import styles from "./LinkButton.module.css";

export const LinkButton = ({ children, to, ...props }) => {
  return (
    <Link className={styles.linkButton} to={to} {...props}>
      {children}
    </Link>
  );
};
