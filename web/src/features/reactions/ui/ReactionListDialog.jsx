import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/index.js";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import {
  useGetReactionsQuery,
  useDeleteReactionMutation,
} from "../api/reactionsApi.js";
import styles from "./ReactionListDialog.module.css";

export const ReactionListDialog = ({
  open,
  onClose,
  target,
  targetId,
  postId,
  context,
}) => {
  const user = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState("");
  const query = useGetReactionsQuery({ target, targetId }, { skip: !open });
  const [remove, removal] = useDeleteReactionMutation();
  const rows = (query.data ?? []).filter(
    (row) => !filter || row.type === filter,
  );
  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Community reactions"
      busy={removal.isLoading}
    >
      {context && (
        <div className={styles.targetContext}>
          <h3>{context.kind === "question" ? "Question" : "Comment"} {context.id}</h3>
          {context.title && <p>{context.title}</p>}
          {context.excerpt && <p>{context.excerpt}</p>}
          {context.author && <p>By {context.author}</p>}
          {context.postId && <p>On question {context.postId}</p>}
        </div>
      )}
      <label>
        Show reactions
        <SelectControl
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="">All reactions</option>
          <option value="like">Likes</option>
          <option value="dislike">Dislikes</option>
        </SelectControl>
      </label>
      {query.isFetching && <p role="status">Opening the reaction list…</p>}
      {query.error && (
        <p role="alert">
          {getErrorMessage(query.error, "Reactions could not be loaded.")}
        </p>
      )}
      {!query.isFetching && !query.error && rows.length === 0 && (
        <p>No reactions here yet.</p>
      )}
      <ul className={styles.reactionList}>
        {rows.map((row) => (
          <li key={row.id}>
            <Link to={`/users/${row.author_id}`} onClick={onClose}>
              {row.author?.full_name ||
                row.author?.login ||
                `Member ${row.author_id}`}
            </Link>
            <span>{row.type === "like" ? "Liked" : "Disliked"}</span>
            {user?.role === "admin" && (
              <button
                type="button"
                disabled={removal.isLoading}
                onClick={() =>
                  remove({ target, targetId, postId, authorId: row.author_id })
                }
              >
                Remove reaction by {row.author?.login || row.author_id}
              </button>
            )}
          </li>
        ))}
      </ul>
      {removal.error && (
        <p role="alert">
          {getErrorMessage(
            removal.error,
            "That reaction could not be removed.",
          )}
        </p>
      )}
    </ModalDialog>
  );
};
