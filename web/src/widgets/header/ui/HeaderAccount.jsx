import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { UserAvatar } from "../../../entities/user/index.js";
import { LogoutButton } from "../../../features/auth/index.js";
import { LinkButton } from "../../../shared/ui/link-button/index.js";
import styles from "./Header.module.css";

export const HeaderAccount = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const openSignIn = () => navigate("/login");

  return (
    <div className={styles.accountArea}>
      {user && (
        <Link className={styles.accountLink} to="/account">
          <UserAvatar user={user} />
          <span className={styles.identity}>
            <span className={styles.login}>{user.login}</span>
            <span className={styles.role}>{user.role}</span>
          </span>
        </Link>
      )}
      {user && <LogoutButton />}
      {!user && (
        <button
          className={styles.avatarButton}
          type="button"
          aria-label="Sign in"
          title="Sign in"
          onClick={openSignIn}
        >
          <UserAvatar user={null} />
        </button>
      )}
      {!user && <span className={styles.guestStatus}>Welcome, Guest</span>}
      {!user && <LinkButton to="/login">Sign in</LinkButton>}
      {!user && <LinkButton to="/register">Register</LinkButton>}
    </div>
  );
};
