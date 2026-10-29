import { useNavigate } from "react-router";
import {
  AUTH_LINKS,
  AuthField,
  AuthFormActions,
  AuthLinks,
  AuthNotice,
  AuthWindow,
  REGISTER_INITIAL_VALUES,
  useRegisterMutation,
  useValidatedAuthForm,
  validateRegistration,
} from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { AccountIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const RegisterPage = () => {
  const [register, { error, isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const submit = async (values) => {
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

  const form = useValidatedAuthForm({
    initialValues: REGISTER_INITIAL_VALUES,
    validator: validateRegistration,
    onSubmit: submit,
  });

  return (
    <AuthWindow title="Create a Usof account" Icon={AccountIcon}>
      <div className={styles.intro}>
        <h1>Join the conversation</h1>
        <p>Create an account, then confirm your email before signing in.</p>
      </div>
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(
            error,
            "The account could not be created. Check the form and try again.",
          )}
          {error.data?.error?.code === "EMAIL_UNAVAILABLE" &&
            " Your account is saved; you can request a new confirmation link."}
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
          autoComplete="new-password"
          error={form.fieldErrors.password}
          label="Password"
          maxLength={128}
          minLength={8}
          name="password"
          onChange={form.handleChange}
          type="password"
          value={form.values.password}
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
        <AuthFormActions
          isLoading={isLoading}
          label="Create account"
          loadingLabel="Creating account…"
          note="We’ll send a confirmation link to this address."
        />
      </form>
      <AuthLinks links={AUTH_LINKS.register} />
    </AuthWindow>
  );
};
