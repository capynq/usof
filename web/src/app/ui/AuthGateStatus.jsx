import { AUTH_STATUS } from "../../features/auth/index.js";
import { getErrorMessage } from "../../shared/api/index.js";
import { AUTH_GATE_COPY } from "../authGateConstants.js";
import { StatusWindow } from "./StatusWindow.jsx";
import styles from "./AuthGateStatus.module.css";

export const AuthGateStatus = ({ status, error, onRetry, onSignInAgain }) => {
  const restoreErrorCopy = AUTH_GATE_COPY.restoreError;
  const restoreErrorStatus = {
    ...restoreErrorCopy,
    message: getErrorMessage(error, restoreErrorCopy.message),
  };

  return (
    <main className={styles.statusPage}>
      {status === AUTH_STATUS.restoring && (
        <StatusWindow status={AUTH_GATE_COPY.restoring} />
      )}
      {status === AUTH_STATUS.restoreError && (
        <StatusWindow status={restoreErrorStatus}>
          <div className={styles.actions}>
            <button type="button" onClick={onRetry}>
              Try again
            </button>
            <button type="button" onClick={onSignInAgain}>
              Sign in again
            </button>
          </div>
        </StatusWindow>
      )}
    </main>
  );
};
