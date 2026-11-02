import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SESSION_RESTORE_TIMEOUT_MS } from "../../../shared/config.js";
import { useGetCurrentUserQuery } from "../api/authApi.js";
import {
  selectAuth,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionRestored,
  sessionSynced,
  sessionEnded,
} from "./authSlice.js";
import {
  AUTH_ENDPOINTS,
  AUTH_STATUS,
  SESSION_RESTORE_TIMEOUT_ERROR,
  SESSION_STORAGE_KEY,
} from "./constants.js";
import { endAuthSession } from "./endAuthSession.js";
import { readStoredSession } from "./sessionStorage.js";
import { baseApi, HTTP_STATUS } from "../../../shared/api/index.js";
import { useSessionExpiry } from "./useSessionExpiry.js";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const { status, token, expiresAt, generation } = useSelector(selectAuth);
  const [timedOut, setTimedOut] = useState(false);
  const { currentData: data, error } = useGetCurrentUserQuery(generation, {
    skip: !token || status !== AUTH_STATUS.restoring,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (status !== AUTH_STATUS.restoring) return;
    setTimedOut(false);

    if (!token) {
      dispatch(sessionEnded());

      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(baseApi.util.getRunningQueryThunk(AUTH_ENDPOINTS.getCurrentUser, generation))?.abort();
      setTimedOut(true);
      dispatch(sessionRestoreFailed());
    }, SESSION_RESTORE_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [status, generation, token, dispatch]);

  useEffect(() => {
    if ([AUTH_STATUS.restoring, AUTH_STATUS.authenticated].includes(status) && data) {
      dispatch(sessionRestored(data));
    }
  }, [status, data, dispatch]);

  useEffect(() => {
    if (status === AUTH_STATUS.restoring && error && error.status !== HTTP_STATUS.unauthorized) {
      dispatch(sessionRestoreFailed());
    }
  }, [status, dispatch, error]);

  useEffect(() => {
    const syncSession = (event) => {
      if (
        event.storageArea !== window.localStorage ||
        (event.key !== SESSION_STORAGE_KEY && event.key !== null)
      )
        return;

      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        try {
          window.sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            event.newValue ?? JSON.stringify({ tabLocal: true, ended: true }),
          );
        } catch {}
      }

      const session = readStoredSession();
      if (session?.token === token && session?.expiresAt === expiresAt) return;
      if (session?.token) dispatch(sessionSynced(session));
      else dispatch(sessionEnded());
    };

    window.addEventListener("storage", syncSession);

    return () => window.removeEventListener("storage", syncSession);
  }, [token, expiresAt, dispatch]);

  useSessionExpiry({
    dispatch,
    expiresAt,
    status,
  });

  const retryRestore = () => dispatch(sessionRestoreStarted());

  const signInAgain = () => {
    endAuthSession(dispatch);
  };

  return {
    status,
    error: timedOut ? SESSION_RESTORE_TIMEOUT_ERROR : error,
    retryRestore,
    signInAgain,
  };
};
