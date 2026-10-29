import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { endAuthSession } from "../../../features/auth/model/endAuthSession.js";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useDeleteManagementRecordMutation } from "../api/managementApi.js";

export const ManagementDeleteAction = ({ resource, record, label }) => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [remove, state] = useDeleteManagementRecordMutation();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteRecord = async (event) => {
    event.preventDefault();

    if (confirmation !== String(record.id) || state.isLoading) {
      return;
    }

    try {
      await remove({ resource, id: record.id }).unwrap();
      setOpen(false);

      if (resource === "users" && Number(user.id) === Number(record.id)) {
        await navigate("/", { replace: true, flushSync: true });
        endAuthSession(dispatch);
      }
    } catch {}
  };

  return (
    <div className="inline-action">
      <button
        type="button"
        aria-label={`Delete ${label} ${record.id}`}
        onClick={() => {
          state.reset();
          setConfirmation("");
          setOpen(true);
        }}
      >
        Delete
      </button>
      <ModalDialog
        open={open}
        title={`Delete ${label} ${record.id}?`}
        busy={state.isLoading}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={deleteRecord}>
          <p>
            {resource === "users"
              ? "This permanently deletes the member and their questions, comments, reactions, and favorites."
              : resource === "categories"
                ? "This removes the category from all questions. Questions are kept."
                : "Replies are kept with a removed-comment marker when necessary."}
          </p>
          <label>
            Type record ID {record.id} to confirm
            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              required
            />
          </label>
          {state.error && (
            <p role="alert">{getErrorMessage(state.error, "The record could not be deleted.")}</p>
          )}
          <button type="submit" disabled={confirmation !== String(record.id) || state.isLoading}>
            {state.isLoading ? "Deleting…" : "Permanently delete"}
          </button>
        </form>
      </ModalDialog>
    </div>
  );
};
