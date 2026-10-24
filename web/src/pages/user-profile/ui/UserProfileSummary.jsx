import { formatMemberDate, getUserDisplayName, UserAvatar } from "../../../entities/user/index.js";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import styles from "./UserProfilePage.module.css";

export const UserProfileSummary = ({ user }) => (
  <WindowShell
    title="Community profile"
    className={styles.profile}
    bodyClassName={styles.profileBody}
    labelledBy="profile-title"
  >
    <UserAvatar user={user} size="large" />
    <div className={styles.identity}>
      <h1 id="profile-title">{getUserDisplayName(user)}</h1>
      <p>@{user.login} · {user.role}</p>
      <dl className={styles.facts}>
        <div><dt>Rating</dt><dd>{user.rating}</dd></div>
        <div><dt>Member since</dt><dd>{formatMemberDate(user.created_at)}</dd></div>
      </dl>
    </div>
  </WindowShell>
);
