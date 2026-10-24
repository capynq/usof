import { Link } from "react-router";
import { getUserDisplayName } from "../lib/getUserDisplayName.js";
import styles from "./AuthorLink.module.css";

export const AuthorLink = ({ user }) => {
  if (!user?.id) {
    return <span>{getUserDisplayName(user)}</span>;
  }

  return (
    <Link className={styles.link} to={`/users/${user.id}`}>
      {getUserDisplayName(user, "View profile")}
    </Link>
  );
};
