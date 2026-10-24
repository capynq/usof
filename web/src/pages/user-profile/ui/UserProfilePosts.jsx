import { Link } from "react-router";
import { getUserDisplayName } from "../../../entities/user/index.js";
import { PostCollection } from "../../../entities/post/index.js";
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
      <nav className={styles.pagination} aria-label="Profile questions pages">
        <button className="button" type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        <span>Page {posts.meta.page} of {posts.meta.total_pages}</span>
        <button className="button" type="button" disabled={currentPage >= posts.meta.total_pages} onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </nav>
    )}
  </section>
);
