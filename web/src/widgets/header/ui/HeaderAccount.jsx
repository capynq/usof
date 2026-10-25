import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { AuthenticatedHeader } from "./AuthenticatedHeader.jsx";
import { GuestHeader } from "./GuestHeader.jsx";
import styles from "./Header.module.css";

export const HeaderAccount = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className={styles.accountArea}>
      {user ? <AuthenticatedHeader user={user} /> : <GuestHeader />}
    </div>
  );
};
