import { FooterCompanion } from "../../../shared/ui/mascot/FooterCompanion.jsx";
import styles from "./Footer.module.css";

export const Footer = ({ mascotContext = "browse" }) => (
  <footer className={`status-bar ${styles.footer}`}>
    <p className={`status-bar-field ${styles.service}`}>Usof</p>
    <p className="status-bar-field">Share what you learn. Help someone build.</p>
    <FooterCompanion context={mascotContext} />
  </footer>
);
