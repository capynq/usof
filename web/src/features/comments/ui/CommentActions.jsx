import { useState } from "react";
import { ReactionControls } from "../../reactions/index.js";
import { CommentForm } from "./CommentForm.jsx";
import { ReplyAction } from "./ReplyAction.jsx";
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
        <ReplyAction
          canReply={capabilities.canReply}
          currentUser={currentUser}
          isReplying={isReplying}
          onToggle={() => setIsReplying((value) => !value)}
        />
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
