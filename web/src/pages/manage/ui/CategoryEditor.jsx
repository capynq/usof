import { useState } from "react";
import { ModalDialog } from "../../../shared/ui/confirm-dialog/ModalDialog.jsx";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useSaveManagementRecordMutation } from "../api/managementApi.js";
import { MANAGEMENT_RESOURCES } from "../model/constants.js";

export const CategoryEditor = ({ record, onClose }) => {
  const [values, setValues] = useState({
    title: record?.title ?? "",
    description: record?.description ?? "",
  });
  const [error, setError] = useState("");
  const [save, state] = useSaveManagementRecordMutation();

  const submit = async (event) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Give the category a title.");

      return;
    }

    try {
      await save({
        resource: MANAGEMENT_RESOURCES.categories,
        id: record?.id,
        body: {
          title: values.title.trim(),
          description: values.description.trim(),
        },
      }).unwrap();
      onClose();
    } catch {}
  };

  return (
    <ModalDialog
      open
      title={record ? "Edit category" : "Create category"}
      onClose={onClose}
      busy={state.isLoading}
    >
      <form className="stack-form" onSubmit={submit}>
        <label>
          Title
          <input
            value={values.title}
            onChange={(event) => setValues({ ...values, title: event.target.value })}
            required
            maxLength={100}
          />
        </label>
        <label>
          Description
          <textarea
            value={values.description}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
            maxLength={2000}
            rows={4}
          />
        </label>
        <button type="submit" disabled={state.isLoading}>
          {state.isLoading ? "Saving…" : "Save category"}
        </button>
        {(error || state.error) && (
          <p role="alert">
            {error || getErrorMessage(state.error, "The category could not be saved.")}
          </p>
        )}
      </form>
    </ModalDialog>
  );
};
