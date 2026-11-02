import { Link, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { AuthNotice } from "./AuthNotice.jsx";
import styles from "./SessionNotice.module.css";

export const SessionNotice = () => {
  const location = useLocation();
  const notice = useSelector((state) => state.auth.notice);

  if (!notice) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <AuthNotice>
        {notice}{" "}
        {location.pathname !== "/login" && (
          <Link to="/login" state={{ from: location }}>
            Login
          </Link>
        )}
      </AuthNotice>
    </div>
  );
};
