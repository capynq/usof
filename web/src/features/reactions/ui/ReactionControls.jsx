import { Link } from "react-router";
import { REACTION_OPTIONS } from "../model/constants.js";
import { useReactionController } from "../model/useReactionController.js";
import { ReactionButton } from "./ReactionButton.jsx";
import styles from "./ReactionControls.module.css";

export const ReactionControls = ({
  target,
  targetId,
  postId,
  likeCount = 0,
  dislikeCount = 0,
  viewerReaction,
  currentUser,
  canReact = true,
}) => {
  const {
    isBusy,
    isAvailable,
    availabilityMessage,
    errorMessage,
    changeReaction,
  } = useReactionController({
    target,
    targetId,
    postId,
    viewerReaction,
    currentUser,
    canReact,
  });
  const reactionCounts = { like: likeCount, dislike: dislikeCount };

  return (
    <div className={styles.controls} aria-label="Reactions">
      {REACTION_OPTIONS.map(({ type, label, symbol }) => (
        <ReactionButton
          key={type}
          label={label}
          symbol={symbol}
          count={reactionCounts[type]}
          isSelected={viewerReaction === type}
          disabled={!isAvailable || isBusy}
          title={availabilityMessage}
          onClick={() => changeReaction(type)}
        />
      ))}
      {!currentUser && <Link to="/login">Sign in to react</Link>}
      {currentUser && !canReact && <span className={styles.error}>Reactions are closed on inactive content.</span>}
      {errorMessage && <span className={styles.error} role="alert">{errorMessage}</span>}
    </div>
  );
};
