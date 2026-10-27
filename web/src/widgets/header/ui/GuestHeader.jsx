import { Link } from "react-router";
import { UserAvatar } from "../../../entities/user/index.js";
import { ActionButtonGroup } from "../../../shared/ui/action-button-group/index.js";
import styles from "./Header.module.css";

const GUEST_LINKS = [
  { to: "/login", label: "Sign in" },
  { to: "/register", label: "Register" },
];

export const GuestHeader = () => (
  <>
    <span className={styles.guestIdentity}>
      <Link className={styles.avatarButton} to="/login" aria-label="Sign in" title="Sign in">
        <UserAvatar user={null} />
      </Link>
      <span className={styles.guestStatus}>Welcome, Guest</span>
    </span>
    <ActionButtonGroup actions={GUEST_LINKS} />
  </>
);
