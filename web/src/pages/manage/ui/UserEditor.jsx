import { SelectControl } from "../../../shared/ui/select-control/index.js";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import { useUserEditor } from "../model/useUserEditor.js";

export const UserEditor = ({ record, onClose }) => {
  const { values, error, isCreating, isLoading, change, changeAndClearError, submit } =
    useUserEditor({ record, onClose });

  return (
    <ModalDialog
      open
      title={record ? `Edit ${record.login}` : "Create a member"}
      onClose={onClose}
      busy={isLoading}
    >
      <form onSubmit={submit} className="stack-form">
        <label>
          Login
          <input
            name="login"
            value={values.login}
            onChange={changeAndClearError}
            required
            minLength={3}
            maxLength={40}
            autoComplete="off"
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={changeAndClearError}
            required
            maxLength={254}
            autoComplete="off"
          />
        </label>
        <label>
          Full name
          <input
            name="full_name"
            value={values.full_name}
            onChange={changeAndClearError}
            maxLength={120}
          />
        </label>
        <label>
          Role
          <SelectControl name="role" value={values.role} onChange={change}>
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </SelectControl>
        </label>
        {isCreating && (
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={change}
              required
              minLength={8}
              maxLength={128}
            />
          </label>
        )}
        {isCreating && (
          <label>
            Confirm password
            <input
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={values.password_confirmation}
              onChange={change}
              required
              minLength={8}
              maxLength={128}
            />
          </label>
        )}
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving…" : "Save member"}
        </button>
      </form>
    </ModalDialog>
  );
};
