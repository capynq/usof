import { AskQuestionLink } from "../../../features/post-management/ui/AskQuestionLink.jsx";
import { NavLink } from "react-router";
import usofMark from "../../../shared/assets/usof-mark.svg";
import { NavigationLinks } from "../../../shared/ui/navigation-links/index.js";
import { HeaderSearch } from "./HeaderSearch.jsx";
import { HeaderAccount } from "./HeaderAccount.jsx";
import { HEADER_NAVIGATION_ITEMS } from "../model/constants.js";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <NavLink className={styles.brand} to="/" aria-label="Usof home">
          <img className={styles.brandMark} src={usofMark} alt="" width="32" height="32" />
          <span>Usof</span>
        </NavLink>
        <HeaderSearch />
        <HeaderAccount />
      </div>
      <div className={styles.navigationBar}>
        <NavigationLinks
          ariaLabel="Main navigation"
          className={styles.navigation}
          items={HEADER_NAVIGATION_ITEMS}
          linkClassName={styles.navLink}
          activeLinkClassName={styles.activeLink}
          iconClassName={styles.navIcon}
        />
        <AskQuestionLink className={styles.createAction} />
      </div>
    </header>
  );
};
