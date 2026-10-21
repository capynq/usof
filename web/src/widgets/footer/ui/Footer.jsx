import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={`status-bar ${styles.footer}`}>
      <p className={`status-bar-field ${styles.service}`}>Usof</p>
      <p className="status-bar-field">Share what you learn. Help someone build.</p>
    </footer>
  );
};
