import { Link } from "react-router";
import { getUserDisplayName } from "../../../entities/user/index.js";
import { PostCollection } from "../../../entities/post/index.js";
import { Pagination } from "../../../shared/ui/pagination/Pagination.jsx";
import styles from "./UserProfilePage.module.css";

export const UserProfilePosts = ({ user, posts, error, isLoading, currentPage, onPageChange }) => (
  <section className={styles.posts} aria-labelledby="user-posts-title">
    <div className={styles.postsHeading}>
      <h2 id="user-posts-title">Questions by {getUserDisplayName(user)}</h2>
      <Link to="/">Recent questions</Link>
    </div>
    <PostCollection
      posts={posts?.data}
      error={error}
      isLoading={isLoading}
      loadingMessage="Loading questions…"
      emptyMessage="This member has not posted any questions."
      listClassName={styles.postList}
      stateClassName={styles.state}
      errorClassName={styles.error}
    />
    {!isLoading && posts?.meta?.total_pages > 1 && (
      <Pagination
        page={posts.meta.page}
        totalPages={posts.meta.total_pages}
        onPageChange={onPageChange}
        label="Profile question pages"
      />
    )}
  </section>
);
