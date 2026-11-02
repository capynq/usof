import { useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { useCommentAnchor } from "../model/useCommentAnchor.js";
import { CommentForm } from "./CommentForm.jsx";
import { CommentList } from "./CommentList.jsx";
import { CommentDiscussionNotices } from "./CommentDiscussionNotices.jsx";
import styles from "./CommentDiscussion.module.css";

export const CommentDiscussion = ({ postId, postStatus, discussion }) => {
  const { visible: showLoading, completing } = useMinimumLoading(
    discussion.isLoading,
    discussion.error,
  );
  useCommentAnchor(discussion.comments, !showLoading && !discussion.error);

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
        isLoading={showLoading}
        completing={completing}
        commentTree={discussion.commentTree}
      />
      {!showLoading && discussion.commentTree.length > 0 && (
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
