import { useState } from "react";
import { Link } from "react-router";
import {
  AuthField,
  AuthNotice,
  RESET_INITIAL_VALUES,
  useResetPasswordMutation,
  validatePasswordReset,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ResetPasswordForm = ({ token }) => {
  const [values, setValues] = useState(RESET_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resetPassword, { data, error, isLoading }] = useResetPasswordMutation();

  const changeField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const errors = validatePasswordReset(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    resetPassword({ token, new_password: values.new_password });
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      {data?.message && (
        <AuthNotice type="success">
          {data.message} <Link to="/login">Sign in</Link>
        </AuthNotice>
      )}
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "This reset link is invalid or has expired.")}
        </AuthNotice>
      )}
      <AuthField
        autoComplete="new-password"
        error={fieldErrors.new_password}
        label="New password"
        maxLength={128}
        minLength={8}
        name="new_password"
        onChange={changeField}
        type="password"
        value={values.new_password}
      />
      <AuthField
        autoComplete="new-password"
        error={fieldErrors.password_confirmation}
        label="Confirm password"
        maxLength={128}
        minLength={8}
        name="password_confirmation"
        onChange={changeField}
        type="password"
        value={values.password_confirmation}
      />
      <div className={styles.actions}>
        <button className={styles.primaryButton} type="submit" disabled={isLoading}>
          {isLoading && "Saving…"}
          {!isLoading && "Save new password"}
        </button>
      </div>
    </form>
  );
};
