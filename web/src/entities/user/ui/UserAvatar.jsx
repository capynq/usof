import { Image } from "../../../shared/ui/image/Image.jsx";
import styles from "./UserAvatar.module.css";

export const UserAvatar = ({ user, size = "regular" }) => {
  const initials = user?.login?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <span className={`${styles.avatar} ${styles[size]}`} aria-hidden="true">
      {user?.profile_picture && (
        <Image
          src={user.profile_picture}
          alt=""
          reveal={size === "large"}
          fallback={<span>{initials}</span>}
        />
      )}
      {!user?.profile_picture && <span>{initials}</span>}
    </span>
  );
};
