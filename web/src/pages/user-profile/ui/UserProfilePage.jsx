import { useParams, useSearchParams } from "react-router";
import { useGetPostsQuery } from "../../../entities/post/index.js";
import { useGetPublicUserQuery } from "../../../entities/user/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { parsePositivePage, withPageParam } from "../../../shared/lib/queryParams.js";
import { PROFILE_POST_PAGE_SIZE } from "../model/constants.js";
import { UserProfilePosts } from "./UserProfilePosts.jsx";
import { UserProfileSummary } from "./UserProfileSummary.jsx";
import styles from "./UserProfilePage.module.css";

export const UserProfilePage = () => {
  const { userId: rawUserId } = useParams();
  const userId = Number(rawUserId);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parsePositivePage(searchParams.get("page"));
  const isValidUserId = Number.isInteger(userId) && userId > 0;
  const { data: user, error: userError, isLoading: isUserLoading } = useGetPublicUserQuery(userId, { skip: !isValidUserId });
  const { data: posts, error: postsError, isLoading: arePostsLoading } = useGetPostsQuery({
    author_id: userId,
    page: currentPage,
    page_size: PROFILE_POST_PAGE_SIZE,
    sort: "date",
    summary: true,
  }, { skip: !isValidUserId });

  const changePage = (page) => {
    setSearchParams((current) => withPageParam(current, page));
  };

  if (!isValidUserId) {
    return <p className={styles.error} role="alert">That profile address is not valid.</p>;
  }

  if (isUserLoading) {
    return <p className={styles.state}>Loading profile…</p>;
  }

  if (userError || !user) {
    return <p className={styles.error} role="alert">{getErrorMessage(userError, "This profile could not be found.")}</p>;
  }

  return (
    <div className={styles.page}>
      <UserProfileSummary user={user} />
      <UserProfilePosts
        user={user}
        posts={posts}
        error={postsError}
        isLoading={arePostsLoading}
        currentPage={currentPage}
        onPageChange={changePage}
      />
    </div>
  );
};
