import { useState } from "react";
import {
  AuthField,
  AuthNotice,
  EMAIL_INITIAL_VALUES,
  useResendConfirmationMutation,
  validateEmailRequest,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ResendConfirmationForm = () => {
  const [values, setValues] = useState(EMAIL_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resendConfirmation, { data, error, isLoading, reset }] =
    useResendConfirmationMutation();

  const changeEmail = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submitResend = (event) => {
    event.preventDefault();
    reset();

    const errors = validateEmailRequest(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    resendConfirmation({ email: values.email.trim() });
  };

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
      <form className={styles.form} noValidate onSubmit={submitResend}>
        <AuthField
          autoComplete="email"
          error={fieldErrors.email}
          label="Email address"
          maxLength={254}
          name="email"
          onChange={changeEmail}
          type="email"
          value={values.email}
        />
        <button className={styles.secondaryButton} type="submit" disabled={isLoading}>
          {isLoading && "Requesting…"}
          {!isLoading && "Resend confirmation"}
        </button>
      </form>
    </section>
  );
};
