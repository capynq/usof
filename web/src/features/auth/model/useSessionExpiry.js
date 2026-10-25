import { useEffect } from "react";
import { sessionExpired } from "./authSlice.js";
import { AUTH_STATUS } from "./constants.js";
import { endAuthSession } from "./endAuthSession.js";

export const useSessionExpiry = ({ dispatch, expiresAt, status }) => {
  useEffect(() => {
    if (status !== AUTH_STATUS.authenticated || !expiresAt) return undefined;

    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      endAuthSession(dispatch, sessionExpired());
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      endAuthSession(dispatch, sessionExpired());
    }, remaining);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, expiresAt, status]);
};
