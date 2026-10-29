import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectCurrentUser } from "../../../features/auth/index.js";
import { endAuthSession } from "../../../features/auth/model/endAuthSession.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { LOGIN_PATTERN } from "../../../shared/lib/regexPatterns.js";
import { useSaveManagementRecordMutation } from "../api/managementApi.js";
import { buildUserPayload, getInitialUserValues } from "./userForm.js";

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
      setError("Use letters, digits, underscores, or hyphens for the login.");

      return;
    }

    if (isCreating && values.password !== values.password_confirmation) {
      setError("Password confirmation must match.");

      return;
    }

    const body = buildUserPayload(values, isCreating);
    const isOwnRecord = Number(user.id) === Number(record?.id);
    const emailChanged = Boolean(record && body.email !== record.email);

    try {
      const result = await save({ resource: "users", id: record?.id, body }).unwrap();

      if (isOwnRecord && emailChanged) {
        await navigate("/email-confirmation", {
          state: { registrationDelivery: result.data?.delivery },
          flushSync: true,
        });
        endAuthSession(dispatch);

        return;
      }

      onClose();

      if (isOwnRecord && body.role !== record.role) {
        endAuthSession(dispatch);
        navigate("/login", { replace: true });
      }
    } catch (failure) {
      if (failure.data?.error?.code === "EMAIL_UNAVAILABLE") {
        onClose();

        if (isOwnRecord) {
          await navigate("/email-confirmation", {
            state: { emailChangeDeliveryFailed: "self" },
            flushSync: true,
          });
          endAuthSession(dispatch);
        } else {
          await navigate("/email-confirmation", {
            state: { emailChangeDeliveryFailed: "member" },
          });
        }

        return;
      }

      setError(getErrorMessage(failure, "The member could not be saved."));
    }
  };

  return { values, error, isCreating, isLoading, change, changeAndClearError, submit };
};
