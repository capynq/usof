import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "../api/authApi.js";
import {
  selectAuth,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionRestored,
  sessionSynced,
  sessionEnded,
} from "./authSlice.js";
import { AUTH_STATUS, SESSION_STORAGE_KEY } from "./constants.js";
import { endAuthSession } from "./endAuthSession.js";
import { readStoredSession } from "./sessionStorage.js";
import { baseApi } from "../../../shared/api/index.js";
import { useSessionExpiry } from "./useSessionExpiry.js";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const { data, error } = useGetCurrentUserQuery(undefined, {
    skip: !auth.token || auth.status === AUTH_STATUS.restoreError,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (
      [AUTH_STATUS.restoring, AUTH_STATUS.authenticated].includes(
        auth.status,
      ) &&
      data
    ) {
      dispatch(sessionRestored(data));
    }
  }, [auth.status, data, dispatch]);

  useEffect(() => {
    if (
      auth.status === AUTH_STATUS.restoring &&
      error &&
      error.status !== 401
    ) {
      dispatch(sessionRestoreFailed());
    }
  }, [auth.status, dispatch, error]);

  useEffect(() => {
    const syncSession = (event) => {
      if (event.storageArea !== window.localStorage ||
          (event.key !== SESSION_STORAGE_KEY && event.key !== null)) return;
      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        try {
          window.sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            event.newValue ?? JSON.stringify({ tabLocal: true, ended: true }),
          );
        } catch { }
      }
      const session = readStoredSession();
      if (session?.token === auth.token && session?.expiresAt === auth.expiresAt) return;
      dispatch(baseApi.util.resetApiState());
      if (session?.token) dispatch(sessionSynced(session));
      else dispatch(sessionEnded());
    };
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [auth.token, auth.expiresAt, dispatch]);

  useSessionExpiry({
    dispatch,
    expiresAt: auth.expiresAt,
    status: auth.status,
  });

  const retryRestore = () => dispatch(sessionRestoreStarted());

  const signInAgain = () => {
    endAuthSession(dispatch);
  };

  return {
    status: auth.status,
    error,
    retryRestore,
    signInAgain,
  };
};
