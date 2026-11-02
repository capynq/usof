import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { endAuthSession } from "../../../features/auth/model/endAuthSession.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { LOGIN_PATTERN } from "../../../shared/lib/regexPatterns.js";
import { useSaveManagementRecordMutation } from "../api/managementApi.js";
import { buildUserPayload, getInitialUserValues } from "./userForm.js";
import { MANAGEMENT_RESOURCES, USER_EDITOR_MESSAGES } from "./constants.js";

export const useUserEditor = ({ record, onClose }) => {
  const [values, setValues] = useState(() => getInitialUserValues(record));
  const [error, setError] = useState("");
  const [save, saveState] = useSaveManagementRecordMutation();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCreating = !record;
  const isLoading = saveState.isLoading;

  const change = (event) => {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const changeAndClearError = (event) => {
    setError("");
    change(event);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!LOGIN_PATTERN.test(values.login.trim())) {
      setError(USER_EDITOR_MESSAGES.invalidLogin);

      return;
    }

    if (isCreating && values.password !== values.password_confirmation) {
      setError(USER_EDITOR_MESSAGES.passwordMismatch);

      return;
    }

    const body = buildUserPayload(values, isCreating);
    const isOwnRecord = Number(user.id) === Number(record?.id);

    try {
      await save({ resource: MANAGEMENT_RESOURCES.users, id: record?.id, body }).unwrap();
      onClose();

      if (isOwnRecord && body.role !== record.role) {
        endAuthSession(dispatch);
        navigate("/login", { replace: true });
      }
    } catch (failure) {
      setError(getErrorMessage(failure, USER_EDITOR_MESSAGES.saveFailed));
    }
  };

  return { values, error, isCreating, isLoading, change, changeAndClearError, submit };
};
