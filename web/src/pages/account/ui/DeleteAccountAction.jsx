import { useDeleteOwnAccountMutation } from "../../../entities/user/api/userApi.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../../shared/api/index.js";
import { endAuthSession } from "../../../features/auth/model/endAuthSession.js";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import styles from "./DeleteAccountAction.module.css";

export const DeleteAccountAction = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [remove, state] = useDeleteOwnAccountMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    if (confirmation !== user.login || state.isLoading) {
      return;
    }
    try {
      await remove(user.id).unwrap();
      await navigate("/", { replace: true, flushSync: true });
      endAuthSession(dispatch);
    } catch {
    }
  };
  return (
    <section className={styles.dangerZone}>
      <h2>Delete account</h2>
      <p>
        This permanently removes your account, questions, comments, reactions,
        and favorites.
      </p>
      <button
        type="button"
        onClick={() => {
          state.reset();
          setConfirmation("");
          setOpen(true);
        }}
      >
        Delete my account…
      </button>
      <ModalDialog
        open={open}
        title="Permanently delete your account?"
        busy={state.isLoading}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={submit}>
          <p>Your account and its content cannot be recovered.</p>
          <label>
            Type <strong>{user.login}</strong> to confirm
            <input
              autoComplete="off"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              required
            />
          </label>
          {state.error && (
            <p role="alert">
              {getErrorMessage(
                state.error,
                "Your account could not be deleted.",
              )}
            </p>
          )}
          <button
            type="submit"
            disabled={confirmation !== user.login || state.isLoading}
          >
            {state.isLoading ? "Deleting…" : "Permanently delete account"}
          </button>
        </form>
      </ModalDialog>
    </section>
  );
};
