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

export const ResendConfirmationForm = ({ registrationEmail, onResent }) => {
  const [resendConfirmation, { data, error, isLoading, reset }] = useResendConfirmationMutation();

  const form = useValidatedAuthForm({
    initialValues: registrationEmail ? { email: registrationEmail } : EMAIL_INITIAL_VALUES,
    validator: validateEmailRequest,
    onAttempt: () => {
      reset();
      if (registrationEmail) onResent?.();
    },
    onSubmit: async (values) => {
      try {
        await resendConfirmation({ email: registrationEmail || values.email.trim() }).unwrap();
      } catch {
        return;
      }
    },
  });

  return (
    <section className={styles.secondaryPanel} aria-labelledby="resend-title">
      <h2 id="resend-title">Need a new link?</h2>
      <p>
        {registrationEmail
          ? `Request another confirmation link for ${registrationEmail}.`
          : "Enter the account email to request another confirmation link."}
      </p>
      {data?.message && <AuthNotice>{data.message}</AuthNotice>}
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "A new confirmation link could not be requested.")}
        </AuthNotice>
      )}
      <form className={styles.form} noValidate onSubmit={form.handleSubmit}>
        {!registrationEmail && (
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
        )}
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
