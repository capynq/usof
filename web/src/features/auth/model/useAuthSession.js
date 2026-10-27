import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "../api/authApi.js";
import {
  selectAuth,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionRestored,
} from "./authSlice.js";
import { AUTH_STATUS } from "./constants.js";
import { endAuthSession } from "./endAuthSession.js";
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
