import {
  AUTH_LINKS,
  AuthField,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  EMAIL_INITIAL_VALUES,
  useRequestPasswordResetMutation,
  validateEmailRequest,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useFormFields } from "../../../shared/lib/useFormFields.js";
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ForgotPasswordPage = () => {
  const { values, fieldErrors, handleChange: changeEmail, validate } = useFormFields(EMAIL_INITIAL_VALUES);
  const [requestReset, { data, error, isLoading }] = useRequestPasswordResetMutation();

  const submit = async (event) => {
    event.preventDefault();
    const errors = validate(validateEmailRequest);

    if (Object.keys(errors).length) {
      return;
    }

    await requestReset({ email: values.email.trim() });
  };

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
      <form className={styles.form} noValidate onSubmit={submit}>
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
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="submit" disabled={isLoading}>
            {isLoading && "Requesting…"}
            {!isLoading && "Request reset link"}
          </button>
        </div>
      </form>
      <AuthLinks links={AUTH_LINKS.forgotPassword} />
    </AuthWindow>
  );
};
