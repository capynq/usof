import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import {
  getPostPermissions,
  getPostRouteStatus,
  PostRouteMessage,
  usePostRouteData,
} from "../../../entities/post/index.js";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { PostForm } from "../../../features/post-management/index.js";
import styles from "./EditPostPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { API_ERROR_MESSAGES, getErrorMessage } from "../../../shared/api/index.js";

export const EditPostPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { isValidPostId, data: post, error, isLoading } = usePostRouteData();
  const { visible: showLoading, completing } = useMinimumLoading(isLoading, error);
  const routeStatus = getPostRouteStatus({ isValidPostId, isLoading: showLoading, error, post });

  if (routeStatus === "invalid") {
    return (
      <PostRouteMessage className={styles.error}>
        That question address is not valid.
      </PostRouteMessage>
    );
  }

  if (routeStatus === "loading") {
    return <LoadingIndicator completing={completing} expanded>Loading question…</LoadingIndicator>;
  }

  if (routeStatus === "unavailable") {
    return (
      <PostRouteMessage className={styles.error}>
        {getErrorMessage(error, API_ERROR_MESSAGES.postNotFound)}
      </PostRouteMessage>
    );
  }

  const permissions = getPostPermissions(post, currentUser);

  if (!permissions.canManage) {
    return (
      <WindowShell title="Edit question" className={styles.window} bodyClassName={styles.body}>
        <PostRouteMessage>You can edit only your own questions.</PostRouteMessage>
        <Link to={`/posts/${post.id}`}>Return to the question</Link>
      </WindowShell>
    );
  }

  if (post.status !== "active" && !permissions.isAdmin) {
    return (
      <WindowShell title="Edit question" className={styles.window} bodyClassName={styles.body}>
        <PostRouteMessage>Inactive questions cannot be edited.</PostRouteMessage>
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
      titleIcon={
        <span className={styles.titleIcon} aria-hidden="true">
          ✎
        </span>
      }
    >
      <h1 id="edit-post-title">Edit question</h1>
      <PostForm post={post} isAdmin={permissions.isAdmin} isOwner={permissions.isOwner} />
    </WindowShell>
  );
};
