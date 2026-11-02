import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { StarIcon } from "../../../shared/ui/icons/StarIcon.jsx";
import { getActionButtonClass } from "../../../shared/ui/action-button/index.js";
import { useSetFavoriteMutation } from "../api/favoritesApi.js";
import { FAVORITE_MESSAGES } from "../model/constants.js";
import styles from "./FavoriteButton.module.css";

export const FavoriteButton = ({ post }) => {
  const user = useSelector(selectCurrentUser);
  const [save, state] = useSetFavoriteMutation();
  const saved = Boolean(post.is_favorite);
  const action = state.isLoading
    ? FAVORITE_MESSAGES.saving
    : saved
      ? FAVORITE_MESSAGES.remove
      : FAVORITE_MESSAGES.save;
  //TODO: replace with clsx to make it more readable
  const extraClassName = saved ? `${styles.button} ${styles.saved}` : styles.button;
  const className = getActionButtonClass({ iconOnly: true, extraClassName });

  if (!user) {
    return null;
  }

  return (
    <div className={styles.root}>
      <button
        className={className}
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
          {getErrorMessage(state.error, FAVORITE_MESSAGES.saveFailed)}
        </span>
      )}
    </div>
  );
};
