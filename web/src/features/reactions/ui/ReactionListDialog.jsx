import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/index.js";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useDeleteReactionMutation } from "../api/reactionsApi.js";
import { useReactionListController } from "../model/useReactionListController.js";
import { getReactionAuthorName } from "../model/getReactionAuthorName.js";
import { REACTION_LIST_LABELS } from "../model/constants.js";
import { RefreshControl } from "../../../shared/ui/refresh-control/index.js";
import styles from "./ReactionListDialog.module.css";

export const ReactionListDialog = ({ open, onClose, target, targetId, postId, context }) => {
  const user = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState("");
  const controller = useReactionListController({ open, target, targetId });
  const [remove, removal] = useDeleteReactionMutation();
  const rows = (controller.data ?? []).filter((row) => !filter || row.type === filter);

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={REACTION_LIST_LABELS.title}
      busy={removal.isLoading}
    >
      <div className={styles.content}>
        <RefreshControl
          onClick={controller.onRefresh}
          isFetching={controller.isFetching}
          pendingCount={controller.pendingCount}
          error={controller.error}
        />
        {context && (
          <div className={styles.targetContext}>
            <h3>
              {context.kind === "question"
                ? REACTION_LIST_LABELS.question
                : REACTION_LIST_LABELS.comment}{" "}
              {context.id}
            </h3>
            {context.title && <p>{context.title}</p>}
            {context.excerpt && <p>{context.excerpt}</p>}
            {context.author && <p>{REACTION_LIST_LABELS.by} {context.author}</p>}
            {context.postId && <p>{REACTION_LIST_LABELS.onQuestion} {context.postId}</p>}
          </div>
        )}
        <label className={styles.filter}>
          {REACTION_LIST_LABELS.showReactions}
          <SelectControl value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">{REACTION_LIST_LABELS.allReactions}</option>
            <option value="like">{REACTION_LIST_LABELS.likes}</option>
            <option value="dislike">{REACTION_LIST_LABELS.dislikes}</option>
          </SelectControl>
        </label>
        {controller.isFetching && <p role="status">{REACTION_LIST_LABELS.opening}</p>}
        {controller.error && (
          <p role="alert">{getErrorMessage(controller.error, REACTION_LIST_LABELS.loadFailed)}</p>
        )}
        {!controller.isFetching && !controller.error && rows.length === 0 && (
          <p>{REACTION_LIST_LABELS.empty}</p>
        )}
        <ul className={styles.reactionList}>
          {rows.map((row) => (
            <li key={row.id}>
              <Link className={styles.author} to={`/users/${row.author_id}`} onClick={onClose}>
                {getReactionAuthorName(row)}
              </Link>
              <span>
                {row.type === "like" ? REACTION_LIST_LABELS.liked : REACTION_LIST_LABELS.disliked}
              </span>
              {user?.role === "admin" && (
                <button
                  type="button"
                  aria-label={`${REACTION_LIST_LABELS.removeBy} ${getReactionAuthorName(row)}`}
                  disabled={removal.isLoading}
                  onClick={() => remove({ target, targetId, postId, authorId: row.author_id })}
                >
                  {REACTION_LIST_LABELS.remove}
                </button>
              )}
            </li>
          ))}
        </ul>
        {removal.error && (
          <p role="alert">
            {getErrorMessage(removal.error, REACTION_LIST_LABELS.removeFailed)}
          </p>
        )}
      </div>
    </ModalDialog>
  );
};
