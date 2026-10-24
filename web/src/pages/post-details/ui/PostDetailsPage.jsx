import { Link } from "react-router";
import { useSelector } from "react-redux";
import { UserAvatar } from "../../../entities/user/index.js";
import { PostMeta, usePostRouteData } from "../../../entities/post/index.js";
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

  if (!isValidPostId) {
    return <p className={styles.error} role="alert">That question address is not valid.</p>;
  }

  if (isLoading) {
    return <p className={styles.state}>Loading question…</p>;
  }

  if (error || !post) {
    return (
      <WindowShell title="Question unavailable" className={styles.window} bodyClassName={styles.stateBody}>
          <p role="alert">{getErrorMessage(error, API_ERROR_MESSAGES.postNotFound)}</p>
          <Link to="/">Return to recent questions</Link>
      </WindowShell>
    );
  }

  const isOwner = Number(currentUser?.id) === Number(post.author_id);
  const isAdmin = currentUser?.role === "admin";
  const canManage = isOwner || isAdmin;

  return (
    <div className={styles.page}>
      <WindowShell
        as="article"
        className={styles.window}
        bodyClassName={styles.body}
        title="Question"
        titleIcon={<span className={styles.titleIcon} aria-hidden="true">▤</span>}
      >
          <div className={styles.heading}>
            <div>
              <h1>{post.title}</h1>
              <PostMeta post={post} leading={<UserAvatar user={post.author} />} className={styles.meta} statusClassName={styles.status} />
            </div>
            {canManage && (
              <div className={styles.manage}>
                <Link className={`button ${styles.button}`} to={`/posts/${post.id}/edit`}>Edit</Link>
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
            canReact={post.status === "active" || isAdmin}
          />
      </WindowShell>
      <CommentDiscussion postId={post.id} postStatus={post.status} />
    </div>
  );
};
