import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { FavoriteButton } from "../../../features/favorites/ui/FavoriteButton.jsx";
import { SharePostButton } from "../../../features/post-management/ui/SharePostButton.jsx";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { UserAvatar } from "../../../entities/user/index.js";
import {
  getPostPermissions,
  getPostRouteStatus,
  PostMeta,
  PostRouteMessage,
  usePostRouteData,
} from "../../../entities/post/index.js";
import { CategoryList } from "../../../entities/category/index.js";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { CommentDiscussion } from "../../../features/comments/index.js";
import { ReactionControls } from "../../../features/reactions/index.js";
import { DeletePostButton } from "../../../features/post-management/index.js";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { API_ERROR_MESSAGES, getErrorMessage } from "../../../shared/api/index.js";
import styles from "./PostDetailsPage.module.css";

export const PostDetailsPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { isValidPostId, data: post, error, isLoading } = usePostRouteData();
  const { visible: showLoading, completing } = useMinimumLoading(isLoading, error);
  const routeStatus = getPostRouteStatus({
    isValidPostId,
    isLoading: showLoading,
    error,
    post,
  });

  if (routeStatus === "invalid") {
    return (
      <PostRouteMessage className={styles.error}>
        That question address is not valid.
      </PostRouteMessage>
    );
  }

  if (routeStatus === "loading") {
    return <LoadingIndicator completing={completing}>Loading question…</LoadingIndicator>;
  }

  if (routeStatus === "unavailable") {
    return (
      <WindowShell
        title="Question unavailable"
        className={styles.window}
        bodyClassName={styles.stateBody}
      >
        <PostRouteMessage>
          {getErrorMessage(error, API_ERROR_MESSAGES.postNotFound)}
        </PostRouteMessage>
        <Link to="/">Return to recent questions</Link>
      </WindowShell>
    );
  }

  const permissions = getPostPermissions(post, currentUser);

  return (
    <div className={styles.page}>
      <WindowShell
        as="article"
        className={styles.window}
        bodyClassName={styles.body}
        title="Question"
        titleIcon={
          <span className={styles.titleIcon} aria-hidden="true">
            ▤
          </span>
        }
      >
        <div className={styles.heading}>
          <h1>{post.title}</h1>
          <FavoriteButton post={post} />
        </div>
        <PostMeta post={post} leading={<UserAvatar user={post.author} />} className={styles.meta} />
        <div className={styles.toolbar}>
          <SharePostButton post={post} />
          {permissions.canManage && (
            <div className={styles.manage}>
              <Link className={`button ${styles.button}`} to={`/posts/${post.id}/edit`}>
                Edit
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </div>
        <CategoryList categories={post.categories} className={styles.categories} />
        <div className={styles.content}>{post.content}</div>
        <ReactionControls
          target="post"
          targetId={post.id}
          likeCount={post.like_count}
          dislikeCount={post.dislike_count}
          viewerReaction={post.viewer_reaction}
          currentUser={currentUser}
          canReact={permissions.canReact}
        />
      </WindowShell>
      <CommentDiscussion postId={post.id} postStatus={post.status} />
    </div>
  );
};
