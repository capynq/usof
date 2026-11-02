import { getActionButtonClass } from "../action-button/index.js";
import { REFRESH_CONTROL_LABELS } from "./constants.js";
import styles from "./RefreshControl.module.css";

export const RefreshControl = ({
  onClick,
  isFetching = false,
  pendingCount = 0,
  showCount = true,
  error = null,
}) => {
  const hasPending = pendingCount > 0;
  const pendingLabel = REFRESH_CONTROL_LABELS.pending;
  const actionLabel = showCount ? `${pendingLabel}: ${pendingCount} updates` : pendingLabel;
  const buttonText = isFetching
    ? REFRESH_CONTROL_LABELS.refreshing
    : showCount
      ? `${pendingLabel} (${pendingCount})`
      : pendingLabel;
  const className = getActionButtonClass({
    labeled: true,
    extraClassName: `${styles.button} ${styles.pending}`,
  });

  if (!hasPending && !error) return null;

  return (
    <span className={styles.wrapper}>
      {hasPending && (
        <button
          className={className}
          type="button"
          onClick={onClick}
          disabled={isFetching}
          aria-label={actionLabel}
          title={actionLabel}
        >
          <span>{buttonText}</span>
        </button>
      )}
      {error && (
        <span className={styles.error} role="status">
          {REFRESH_CONTROL_LABELS.failed}
        </span>
      )}
    </span>
  );
};
