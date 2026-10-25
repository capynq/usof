import {
  AUTH_LINKS,
  AuthField,
  AuthFormActions,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  EMAIL_INITIAL_VALUES,
  useRequestPasswordResetMutation,
  useValidatedAuthForm,
  validateEmailRequest,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ForgotPasswordPage = () => {
  const [requestReset, { data, error, isLoading }] = useRequestPasswordResetMutation();

  const submit = async (values) => {
    await requestReset({ email: values.email.trim() });
  };
  const form = useValidatedAuthForm({
    initialValues: EMAIL_INITIAL_VALUES,
    validator: validateEmailRequest,
    onSubmit: submit,
  });

  return (
    <AuthWindow title="Password help" Icon={KeyIcon}>
      <div className={styles.intro}>
        <h1>Reset your password</h1>
        <p>If your account uses this address, Usof will provide reset instructions.</p>
      </div>
      {data && <AuthNotice>{data.message}</AuthNotice>}
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "The reset link could not be requested.")}
        </AuthNotice>
      )}
      <form className={styles.form} noValidate onSubmit={form.handleSubmit}>
        <AuthField
          autoComplete="email"
          error={form.fieldErrors.email}
          label="Email address"
          maxLength={254}
          name="email"
          onChange={form.handleChange}
          type="email"
          value={form.values.email}
        />
        <AuthFormActions isLoading={isLoading} label="Request reset link" loadingLabel="Requesting…" />
      </form>
      <AuthLinks links={AUTH_LINKS.forgotPassword} />
    </AuthWindow>
  );
};
