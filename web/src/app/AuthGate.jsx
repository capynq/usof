import { AUTH_STATUS, useAuthSession } from "../features/auth/index.js";
import { AuthGateStatus } from "./ui/AuthGateStatus.jsx";

export const AuthGate = ({ children }) => {
  const { status, error, retryRestore, signInAgain } = useAuthSession();
  const isResolvingSession =
    status === AUTH_STATUS.restoring || status === AUTH_STATUS.restoreError;

  if (isResolvingSession) {
    return (
      <AuthGateStatus
        status={status}
        error={error}
        onRetry={retryRestore}
        onSignInAgain={signInAgain}
      />
    );
  }

  return children;
};
