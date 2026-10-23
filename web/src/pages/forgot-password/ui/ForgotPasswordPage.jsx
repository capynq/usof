import { useState } from "react";
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
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const ForgotPasswordPage = () => {
  const [values, setValues] = useState(EMAIL_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestReset, { data, error, isLoading }] = useRequestPasswordResetMutation();

  const changeEmail = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const errors = validateEmailRequest(values);
    setFieldErrors(errors);

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
