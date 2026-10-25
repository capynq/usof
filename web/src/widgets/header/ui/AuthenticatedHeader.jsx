import { Link } from "react-router";
import { UserAvatar } from "../../../entities/user/index.js";
import { useLogoutMutation } from "../../../features/auth/index.js";
import { ActionButtonGroup } from "../../../shared/ui/action-button-group/index.js";
import styles from "./Header.module.css";

export const AuthenticatedHeader = ({ user }) => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <>
      <Link className={styles.accountLink} to="/account">
        <UserAvatar user={user} />
        <span className={styles.identity}>
          <span className={styles.login}>{user.login}</span>
          <span className={styles.role}>{user.role}</span>
        </span>
      </Link>
      <ActionButtonGroup actions={[{
        id: "sign-out",
        label: isLoading ? "Signing out…" : "Sign out",
        onClick: logout,
        disabled: isLoading,
      }]} />
    </>
  );
};
