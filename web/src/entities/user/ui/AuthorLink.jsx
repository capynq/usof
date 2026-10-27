import { Link } from "react-router";
import { getUserDisplayName } from "../lib/getUserDisplayName.js";
import styles from "./AuthorLink.module.css";

export const AuthorLink = ({ user, children, className, ariaLabel }) => {
  const content = children ?? getUserDisplayName(user, "View profile");

  if (!user?.id) {
    return (
      <span className={className}>
        {children ?? getUserDisplayName(user)}
      </span>
    );
  }

  return (
    <Link
      className={[styles.link, className].filter(Boolean).join(" ")}
      to={`/users/${user.id}`}
      aria-label={ariaLabel}
    >
      {content}
    </Link>
  );
};
