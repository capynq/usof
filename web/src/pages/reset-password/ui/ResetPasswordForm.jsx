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
  const [resetPassword, { data, error, isLoading }] = useResetPasswordMutation();

  const submit = (values) => {
    resetPassword({ token, new_password: values.new_password });
  };
  const form = useValidatedAuthForm({
    initialValues: RESET_INITIAL_VALUES,
    validator: validatePasswordReset,
    onSubmit: submit,
  });

  return (
    <form className={styles.form} noValidate onSubmit={form.handleSubmit}>
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
      <AuthFormActions isLoading={isLoading} label="Save new password" loadingLabel="Saving…" />
    </form>
  );
};
