import { Link, useLocation, useNavigate } from "react-router";
import {
  AUTH_LINKS,
  AuthField,
  AuthFormActions,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  LOGIN_INITIAL_VALUES,
  useLoginMutation,
  useValidatedAuthForm,
  validateLogin,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import { getReturnPath } from "../model/getReturnPath.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const LoginPage = () => {
  const [login, { error, isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (values) => {
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

  const form = useValidatedAuthForm({
    initialValues: LOGIN_INITIAL_VALUES,
    validator: validateLogin,
    onSubmit: submit,
  });

  return (
    <AuthWindow title="Login to Usof" Icon={KeyIcon}>
      <div className={styles.intro}>
        <h1>Welcome back</h1>
        <p>Use your login, email address, and password to continue.</p>
      </div>
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "Login failed. Check your details and try again.")}
        </AuthNotice>
      )}
      <form className={styles.form} noValidate onSubmit={form.handleSubmit}>
        <AuthField
          autoComplete="username"
          error={form.fieldErrors.login}
          label="Login"
          maxLength={40}
          minLength={3}
          name="login"
          onChange={form.handleChange}
          value={form.values.login}
        />
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
        <AuthField
          autoComplete="current-password"
          error={form.fieldErrors.password}
          label="Password"
          maxLength={128}
          minLength={8}
          name="password"
          onChange={form.handleChange}
          type="password"
          value={form.values.password}
        />
        <AuthFormActions
          isLoading={isLoading}
          label="Login"
          loadingLabel="Logging in…"
          note="Email confirmation is required."
          noteType="pending"
        />
      </form>
      <AuthLinks links={AUTH_LINKS.login} />
      <p className={styles.forgotLink}>
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
    </AuthWindow>
  );
};
