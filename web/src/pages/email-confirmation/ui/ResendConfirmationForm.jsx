import {
  AuthField,
  AuthFormActions,
  AuthNotice,
  EMAIL_INITIAL_VALUES,
  useResendConfirmationMutation,
  useValidatedAuthForm,
  validateEmailRequest,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ResendConfirmationForm = () => {
  const [resendConfirmation, { data, error, isLoading, reset }] = useResendConfirmationMutation();

  const form = useValidatedAuthForm({
    initialValues: EMAIL_INITIAL_VALUES,
    validator: validateEmailRequest,
    onAttempt: reset,
    onSubmit: (values) => resendConfirmation({ email: values.email.trim() }),
  });

  return (
    <section className={styles.secondaryPanel} aria-labelledby="resend-title">
      <h2 id="resend-title">Need a new link?</h2>
      <p>Enter the account email. Usof will tell you whether a link can be sent.</p>
      {data?.message && <AuthNotice>{data.message}</AuthNotice>}
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "A new confirmation link could not be requested.")}
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
        <AuthFormActions
          isLoading={isLoading}
          label="Resend confirmation"
          loadingLabel="Requesting…"
          variant="secondary"
        />
      </form>
    </section>
  );
};
