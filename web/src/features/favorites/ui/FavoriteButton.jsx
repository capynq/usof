import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { StarIcon } from "../../../shared/ui/icons/StarIcon.jsx";
import { useSetFavoriteMutation } from "../api/favoritesApi.js";
import styles from "./FavoriteButton.module.css";

export const FavoriteButton = ({ post }) => {
  const user = useSelector(selectCurrentUser);
  const [save, state] = useSetFavoriteMutation();
  const saved = Boolean(post.is_favorite);
  const action = state.isLoading
    ? "Saving question"
    : saved
      ? "Remove question from favorites"
      : "Save question";
  if (!user) {
    return null;
  }
  return (
    <div className={styles.root}>
      <button
        className={`${styles.button} ${saved ? styles.saved : ""}`}
        type="button"
        aria-label={`${action}: ${post.title}`}
        title={action}
        aria-pressed={saved}
        aria-busy={state.isLoading}
        disabled={state.isLoading}
        onClick={() => save({ postId: post.id, saved: !saved })}
      >
        <StarIcon filled={saved} />
      </button>
      {state.error && (
        <span className={styles.error} role="alert">
          {getErrorMessage(state.error, "Your favorite could not be saved.")}
        </span>
      )}
    </div>
  );
};
