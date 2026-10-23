import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseApi } from "../../../shared/api/index.js";
import { useGetCurrentUserQuery } from "../api/authApi.js";
import {
  selectAuth,
  sessionEnded,
  sessionExpired,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionRestored,
} from "./authSlice.js";
import { AUTH_STATUS } from "./constants.js";
import { clearStoredSession } from "./sessionStorage.js";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const { data, error } = useGetCurrentUserQuery(undefined, {
    skip: auth.status !== AUTH_STATUS.restoring,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (auth.status === AUTH_STATUS.restoring && data) {
      dispatch(sessionRestored(data));
    }
  }, [auth.status, data, dispatch]);

  useEffect(() => {
    if (auth.status === AUTH_STATUS.restoring && error && error.status !== 401) {
      dispatch(sessionRestoreFailed());
    }
  }, [auth.status, dispatch, error]);

  useEffect(() => {
    if (auth.status !== AUTH_STATUS.authenticated || !auth.expiresAt) {
      return undefined;
    }

    const remaining = auth.expiresAt - Date.now();
    if (remaining <= 0) {
      clearStoredSession();
      dispatch(sessionExpired());
      dispatch(baseApi.util.resetApiState());
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearStoredSession();
      dispatch(sessionExpired());
      dispatch(baseApi.util.resetApiState());
    }, remaining);

    return () => window.clearTimeout(timeoutId);
  }, [auth.expiresAt, auth.status, dispatch]);

  const retryRestore = () => dispatch(sessionRestoreStarted());

  const signInAgain = () => {
    clearStoredSession();
    dispatch(sessionEnded());
    dispatch(baseApi.util.resetApiState());
  };

  return {
    status: auth.status,
    error,
    retryRestore,
    signInAgain,
  };
};
