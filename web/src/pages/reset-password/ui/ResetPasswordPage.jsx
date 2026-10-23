import { Link, useSearchParams } from "react-router";
import {
  AUTH_LINKS,
  AuthLinks,
  AuthNotice,
  AuthWindow,
} from "../../../features/auth/index.js";
import { KeyIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";
import { ResetPasswordForm } from "./ResetPasswordForm.jsx";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return (
    <AuthWindow title="Choose a new password" Icon={KeyIcon}>
      <div className={styles.intro}>
        <h1>Set a new password</h1>
        <p>Choose 8–128 characters. Resetting your password ends other sessions.</p>
      </div>
      {!token && (
        <AuthNotice type="error">
          This reset link is missing its token. <Link to="/forgot-password">Request another link</Link>.
        </AuthNotice>
      )}
      {token && <ResetPasswordForm token={token} />}
      <AuthLinks links={AUTH_LINKS.resetPassword} />
    </AuthWindow>
  );
};
