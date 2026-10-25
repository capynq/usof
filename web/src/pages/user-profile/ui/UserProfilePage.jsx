import { getErrorMessage } from "../../../shared/api/index.js";
import { useUserProfileController } from "../model/useUserProfileController.js";
import { UserProfilePosts } from "./UserProfilePosts.jsx";
import { UserProfileSummary } from "./UserProfileSummary.jsx";
import styles from "./UserProfilePage.module.css";

export const UserProfilePage = () => {
  const profile = useUserProfileController();

  if (!profile.isValidUserId) {
    return <p className={styles.error} role="alert">That profile address is not valid.</p>;
  }

  if (profile.isUserLoading) {
    return <p className={styles.state}>Loading profile…</p>;
  }

  if (profile.userError || !profile.user) {
    return <p className={styles.error} role="alert">{getErrorMessage(profile.userError, "This profile could not be found.")}</p>;
  }

  return (
    <div className={styles.page}>
      <UserProfileSummary user={profile.user} />
      <UserProfilePosts
        user={profile.user}
        posts={profile.posts}
        error={profile.postsError}
        isLoading={profile.arePostsLoading}
        currentPage={profile.currentPage}
        onPageChange={profile.changePage}
      />
    </div>
  );
};
