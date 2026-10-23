import { Link } from "react-router";
import { useSelector } from "react-redux";
import { UserAvatar } from "../../../entities/user/index.js";
import { AccountIcon } from "../../../shared/ui/icons/index.js";
import { ACCOUNT_DETAIL_LABELS } from "../model/constants.js";
import { getAccountDetailValue } from "../model/getAccountDetailValue.js";
import styles from "./AccountPage.module.css";

export const AccountPage = () => {
  const user = useSelector((state) => state.auth.user);
  const details = ACCOUNT_DETAIL_LABELS.map(({ key, label }) => ({
    label,
    value: getAccountDetailValue(user, key),
  }));

  return (
    <section className={`window ${styles.window}`} aria-labelledby="account-title">
      <div className="title-bar">
        <div className="title-bar-text">
          <AccountIcon className={styles.titleIcon} />
          My Usof account
        </div>
      </div>
      <div className={`window-body ${styles.body}`}>
        <div className={styles.heading}>
          <UserAvatar user={user} size="large" />
          <div>
            <h1 id="account-title">{user.full_name || user.login}</h1>
            <p>{user.role} account</p>
          </div>
        </div>
        <dl className={styles.details}>
          {details.map(({ label, value }) => (
            <div className={styles.detail} key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.footer}>
          <Link to="/">Back to Usof</Link>
        </div>
      </div>
    </section>
  );
};
