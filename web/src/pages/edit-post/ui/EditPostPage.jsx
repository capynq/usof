import { Link } from "react-router";
import { useSelector } from "react-redux";
import { usePostRouteData } from "../../../entities/post/index.js";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { PostForm } from "../../../features/post-management/index.js";
import styles from "./EditPostPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { API_ERROR_MESSAGES, getErrorMessage } from "../../../shared/api/index.js";

export const EditPostPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { isValidPostId, data: post, error, isLoading } = usePostRouteData();

  if (!isValidPostId) {
    return <p className={styles.error} role="alert">That question address is not valid.</p>;
  }

  if (isLoading) {
    return <p className={styles.state}>Loading question…</p>;
  }

  if (error || !post) {
    return <p className={styles.error} role="alert">{getErrorMessage(error, API_ERROR_MESSAGES.postNotFound)}</p>;
  }

  const isAdmin = currentUser?.role === "admin";
  const isOwner = Number(currentUser?.id) === Number(post.author_id);

  if (!isAdmin && !isOwner) {
    return (
      <WindowShell title="Edit question" className={styles.window} bodyClassName={styles.body}>
          <p role="alert">You can edit only your own questions.</p>
          <Link to={`/posts/${post.id}`}>Return to the question</Link>
      </WindowShell>
    );
  }

  return (
    <WindowShell
      className={styles.window}
      bodyClassName={styles.body}
      labelledBy="edit-post-title"
      title="Edit question"
      titleIcon={<span className={styles.titleIcon} aria-hidden="true">✎</span>}
    >
        <h1 id="edit-post-title">Edit question</h1>
        <PostForm post={post} isAdmin={isAdmin} />
        <Link to={`/posts/${post.id}`}>Cancel and return</Link>
    </WindowShell>
  );
};
