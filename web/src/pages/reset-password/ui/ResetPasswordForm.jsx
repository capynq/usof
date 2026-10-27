import { useState } from "react";
import { Link } from "react-router";
import {
  AuthField,
  AuthFormActions,
  AuthNotice,
  RESET_INITIAL_VALUES,
  useResetPasswordMutation,
  useValidatedAuthForm,
  validatePasswordReset,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ResetPasswordForm = ({ token }) => {
  const [notice, setNotice] = useState("");
  const [resetPassword, { error, isLoading }] = useResetPasswordMutation();

  const submit = async (values) => {
    try {
      const result = await resetPassword({
        token,
        new_password: values.new_password,
      }).unwrap();
      setNotice(result.message);
    } catch {
    }
  };
  const form = useValidatedAuthForm({
    initialValues: RESET_INITIAL_VALUES,
    validator: validatePasswordReset,
    onSubmit: submit,
  });

  if (notice) {
    return (
      <AuthNotice type="success">
        {notice} <Link to="/login">Sign in</Link>
      </AuthNotice>
    );
  }

  return (
    <form className={styles.form} noValidate onSubmit={form.handleSubmit}>
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "This reset link is invalid or has expired.")}
        </AuthNotice>
      )}
      <AuthField
        autoComplete="new-password"
        error={form.fieldErrors.new_password}
        label="New password"
        maxLength={128}
        minLength={8}
        name="new_password"
        onChange={form.handleChange}
        type="password"
        value={form.values.new_password}
      />
      <AuthField
        autoComplete="new-password"
        error={form.fieldErrors.password_confirmation}
        label="Confirm password"
        maxLength={128}
        minLength={8}
        name="password_confirmation"
        onChange={form.handleChange}
        type="password"
        value={form.values.password_confirmation}
      />
      <AuthFormActions
        isLoading={isLoading}
        label="Save new password"
        loadingLabel="Saving…"
      />
    </form>
  );
};
