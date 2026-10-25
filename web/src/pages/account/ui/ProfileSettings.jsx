import styles from "./ProfileSettings.module.css";
import { ProfileAvatarForm } from "./ProfileAvatarForm.jsx";
import { ProfileDetailsForm } from "./ProfileDetailsForm.jsx";

export const ProfileSettings = ({ user }) => (
  <section className={styles.settings} aria-labelledby="profile-settings-title">
    <h2 id="profile-settings-title">Edit your public profile</h2>
    <p className={styles.intro}>
      Your login and display name appear beside your questions. Email changes require a separate confirmation flow.
    </p>
    <ProfileDetailsForm user={user} />
    <ProfileAvatarForm user={user} />
  </section>
);
