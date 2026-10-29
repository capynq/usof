import { useMinimumLoading } from "../shared/ui/loading/index.js";
import { AUTH_STATUS, useAuthSession } from "../features/auth/index.js";
import { AuthGateStatus } from "./ui/AuthGateStatus.jsx";

export const AuthGate = ({ children }) => {
  const { status, error, retryRestore, signInAgain } = useAuthSession();
  const { visible: showRestoring, completing } = useMinimumLoading(status === AUTH_STATUS.restoring, status === AUTH_STATUS.restoreError);
  const isResolvingSession = showRestoring || status === AUTH_STATUS.restoreError;

  if (isResolvingSession) {
    return (
      <AuthGateStatus
        status={showRestoring ? AUTH_STATUS.restoring : status}
        completing={completing}
        error={error}
        onRetry={retryRestore}
        onSignInAgain={signInAgain}
      />
    );
  }

  return children;
};
