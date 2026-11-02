import { Link } from "react-router";
import { UserAvatar } from "../../../entities/user/index.js";
import { ActionButtonGroup } from "../../../shared/ui/action-button-group/index.js";
import styles from "./Header.module.css";

const GUEST_LINKS = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export const GuestHeader = () => (
  <>
    <span className={styles.guestIdentity}>
      <Link className={styles.avatarSlot} to="/login" aria-label="Login" title="Login">
        <UserAvatar user={null} />
      </Link>
      <span className={styles.guestStatus}>Welcome, Guest</span>
    </span>
    <ActionButtonGroup actions={GUEST_LINKS} />
  </>
);
