import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  AUTH_LINKS,
  AuthField,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  LOGIN_INITIAL_VALUES,
  useLoginMutation,
  validateLogin,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import { getReturnPath } from "../model/getReturnPath.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const LoginPage = () => {
  const [values, setValues] = useState(LOGIN_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [login, { error, isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const errors = validateLogin(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    try {
      await login({
        login: values.login.trim(),
        email: values.email.trim(),
        password: values.password,
      }).unwrap();
      navigate(getReturnPath(location), { replace: true });
    } catch {
      return;
    }
  };

  return (
    <AuthWindow title="Sign in to Usof" Icon={KeyIcon}>
      <div className={styles.intro}>
        <h1>Welcome back</h1>
        <p>Use your login, email address, and password to continue.</p>
      </div>
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "Sign-in failed. Check your details and try again.")}
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
          autoComplete="current-password"
          error={fieldErrors.password}
          label="Password"
          maxLength={128}
          minLength={8}
          name="password"
          onChange={changeField}
          type="password"
          value={values.password}
        />
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="submit" disabled={isLoading}>
            {isLoading && "Signing in…"}
            {!isLoading && "Sign in"}
          </button>
          <span className={styles.pendingText}>Email confirmation is required.</span>
        </div>
      </form>
      <AuthLinks links={AUTH_LINKS.login} />
      <p className={styles.forgotLink}>
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
    </AuthWindow>
  );
};
