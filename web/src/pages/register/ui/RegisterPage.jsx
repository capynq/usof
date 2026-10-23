import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AUTH_LINKS,
  AuthField,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  REGISTER_INITIAL_VALUES,
  useRegisterMutation,
  validateRegistration,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { AccountIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const RegisterPage = () => {
  const [values, setValues] = useState(REGISTER_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [register, { error, isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const changeField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const errors = validateRegistration(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    try {
      const result = await register({
        login: values.login.trim(),
        email: values.email.trim(),
        password: values.password,
        password_confirmation: values.password_confirmation,
      }).unwrap();
      navigate("/email-confirmation", {
        state: { registrationDelivery: result.delivery },
      });
    } catch {
      return;
    }
  };

  return (
    <AuthWindow title="Create a Usof account" Icon={AccountIcon}>
      <div className={styles.intro}>
        <h1>Join the conversation</h1>
        <p>Create an account, then confirm your email before signing in.</p>
      </div>
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "The account could not be created. Check the form and try again.")}
          {error.data?.error?.code === "EMAIL_UNAVAILABLE" && " Your account is saved; you can request a new confirmation link."}
        </AuthNotice>
      )}
      <form className={styles.form} noValidate onSubmit={submit}>
        <AuthField
          autoComplete="username"
          error={fieldErrors.login}
          label="Login"
          maxLength={40}
          minLength={3}
          name="login"
          onChange={changeField}
          value={values.login}
        />
        <AuthField
          autoComplete="email"
          error={fieldErrors.email}
          label="Email address"
          maxLength={254}
          name="email"
          onChange={changeField}
          type="email"
          value={values.email}
        />
        <AuthField
          autoComplete="new-password"
          error={fieldErrors.password}
          label="Password"
          maxLength={128}
          minLength={8}
          name="password"
          onChange={changeField}
          type="password"
          value={values.password}
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
            {isLoading && "Creating account…"}
            {!isLoading && "Create account"}
          </button>
          <span className={styles.note}>We’ll send a confirmation link to this address.</span>
        </div>
      </form>
      <AuthLinks links={AUTH_LINKS.register} />
    </AuthWindow>
  );
};
