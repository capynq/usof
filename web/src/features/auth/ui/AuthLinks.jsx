import { Link } from "react-router";
import styles from "./AuthLinks.module.css";

export const AuthLinks = ({ links }) => {
  return (
    <nav className={styles.links} aria-label="Account options">
      {links.map(({ to, label }) => (
        <Link key={to} to={to}>{label}</Link>
      ))}
    </nav>
  );
};
