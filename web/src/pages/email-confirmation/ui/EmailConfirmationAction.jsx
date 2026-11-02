import { Link } from "react-router";
import { AuthNotice, useConfirmEmailMutation } from "../../../features/auth/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";

export const EmailConfirmationAction = ({ token }) => {
  const [confirmEmail, { data, error, isLoading }] = useConfirmEmailMutation();

  return (
    <section className={styles.actionPanel} aria-label="Email confirmation">
      {data?.message && (
        <AuthNotice type="success">
          {data.message} <Link to="/login">Login</Link>
        </AuthNotice>
      )}
      {error && (
        <AuthNotice type="error">
          {getErrorMessage(error, "This confirmation link is invalid or has expired.")}
        </AuthNotice>
      )}
      {!data?.message && <p>Use the button below to confirm this address.</p>}
      {!data?.message && (
        <button
          className={styles.primaryButton}
          type="button"
          disabled={isLoading}
          onClick={() => confirmEmail(token)}
        >
          {isLoading && "Confirming…"}
          {!isLoading && "Confirm email"}
        </button>
      )}
    </section>
  );
};
