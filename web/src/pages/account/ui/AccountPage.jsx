import { DeleteAccountAction } from "./DeleteAccountAction.jsx";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import {
  getUserDisplayName,
  UserAvatar,
} from "../../../entities/user/index.js";
import { AccountIcon } from "../../../shared/ui/icons/index.js";
import { ACCOUNT_DETAIL_LABELS } from "../model/constants.js";
import { getAccountDetailValue } from "../model/getAccountDetailValue.js";
import styles from "./AccountPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { ProfileSettings } from "./ProfileSettings.jsx";

export const AccountPage = () => {
  const user = useSelector((state) => state.auth.user);
  const details = ACCOUNT_DETAIL_LABELS.map(({ key, label }) => ({
    label,
    value: getAccountDetailValue(user, key),
  }));

  return (
    <WindowShell
      className={styles.window}
      bodyClassName={styles.body}
      labelledBy="account-title"
      title="My Usof account"
      titleIcon={<AccountIcon className={styles.titleIcon} />}
    >
      <div className={styles.heading}>
        <UserAvatar user={user} size="large" />
        <div>
          <h1 id="account-title">{getUserDisplayName(user)}</h1>
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
      <ProfileSettings user={user} />
      <DeleteAccountAction user={user} />
      <div className={styles.footer}>
        <Link to="/">Back to Usof</Link>
      </div>
    </WindowShell>
  );
};
