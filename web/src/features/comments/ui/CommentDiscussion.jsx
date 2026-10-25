import { CommentForm } from "./CommentForm.jsx";
import { CommentList } from "./CommentList.jsx";
import { CommentDiscussionNotices } from "./CommentDiscussionNotices.jsx";
import { useCommentDiscussionController } from "../model/useCommentDiscussionController.js";
import styles from "./CommentDiscussion.module.css";

export const CommentDiscussion = ({ postId, postStatus }) => {
  const discussion = useCommentDiscussionController({ postId, postStatus });

  return (
    <section className={styles.discussion} aria-labelledby="discussion-title">
      <div className={styles.heading}>
        <h2 id="discussion-title">Discussion</h2>
        <span>{discussion.comments?.length ?? 0} comments</span>
      </div>
      {discussion.canReply && discussion.currentUser && <CommentForm postId={postId} />}
      <CommentDiscussionNotices
        canReply={discussion.canReply}
        currentUser={discussion.currentUser}
        error={discussion.error}
        isLoading={discussion.isLoading}
        commentTree={discussion.commentTree}
      />
      {!discussion.isLoading && !discussion.error && discussion.commentTree.length > 0 && (
        <CommentList
          comments={discussion.commentTree}
          postId={postId}
          postStatus={postStatus}
          canReply={discussion.canReply}
          currentUser={discussion.currentUser}
        />
      )}
    </section>
  );
};
