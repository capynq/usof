import { NavLink } from "react-router";
import { HomeIcon, InfoIcon } from "../../../shared/ui/icons/index.js";
import usofMark from "../../../shared/assets/usof-mark.svg";
import { NavigationLinks } from "../../../shared/ui/navigation-links/index.js";
import styles from "./Header.module.css";

const navigationItems = [
  { to: "/", end: true, label: "Home", Icon: HomeIcon },
  { to: "/about", label: "About Usof", Icon: InfoIcon }
];

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <NavLink className={styles.brand} to="/" aria-label="Usof home">
          <img className={styles.brandMark} src={usofMark} alt="" width="32" height="32" />
          <span>Usof</span>
        </NavLink>
        <div className={styles.welcome}>
          <span className={styles.welcomeDot} aria-hidden="true" />
          Welcome, guest
        </div>
      </div>
      <NavigationLinks
        ariaLabel="Main navigation"
        className={styles.navigation}
        items={navigationItems}
        linkClassName={styles.navLink}
        activeLinkClassName={styles.activeLink}
        iconClassName={styles.navIcon}
      />
    </header>
  );
};
