import { useState } from "react";
import { Link } from "react-router";
import { ReactionControls } from "../../reactions/index.js";
import { CommentForm } from "./CommentForm.jsx";
import { CommentDeleteAction } from "./CommentDeleteAction.jsx";
import { CommentStatusAction } from "./CommentStatusAction.jsx";
import styles from "./CommentItem.module.css";

export const CommentActions = ({ comment, postId, currentUser, capabilities }) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <ReactionControls
          target="comment"
          targetId={comment.id}
          postId={postId}
          likeCount={comment.like_count}
          dislikeCount={comment.dislike_count}
          viewerReaction={comment.viewer_reaction}
          currentUser={currentUser}
          canReact={capabilities.canReact}
        />
        {capabilities.canReply && currentUser && (
          <button className={`button ${styles.actionButton}`} type="button" onClick={() => setIsReplying((value) => !value)}>
            {isReplying ? "Close reply" : "Reply"}
          </button>
        )}
        {!currentUser && capabilities.canReply && <Link to="/login">Sign in to reply</Link>}
        {capabilities.canModerate && <CommentStatusAction comment={comment} postId={postId} />}
        {capabilities.canDelete && <CommentDeleteAction comment={comment} postId={postId} />}
      </div>
      {isReplying && currentUser && capabilities.canReply && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          parentLabel={comment.author?.full_name || comment.author?.login || "this comment"}
          onCreated={() => setIsReplying(false)}
        />
      )}
    </>
  );
};
