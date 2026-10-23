import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./constants.js";
import { readStoredSession } from "./sessionStorage.js";

const storedSession = readStoredSession();

const initialState = {
  token: storedSession?.token ?? null,
  expiresAt: storedSession?.expiresAt ?? null,
  user: null,
  status: storedSession?.token ? AUTH_STATUS.restoring : AUTH_STATUS.anonymous,
  notice: storedSession?.expired
    ? "Your session has expired. Sign in again to continue."
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionEstablished: (state, action) => ({
      ...state,
      token: action.payload.token,
      expiresAt: action.payload.expiresAt,
      user: action.payload.user,
      status: AUTH_STATUS.authenticated,
      notice: null,
    }),
    sessionRestored: (state, action) => ({
      ...state,
      user: action.payload,
      status: AUTH_STATUS.authenticated,
      notice: null,
    }),
    sessionRestoreStarted: (state) => ({
      ...state,
      status: AUTH_STATUS.restoring,
      notice: null,
    }),
    sessionRestoreFailed: (state) => ({
      ...state,
      status: AUTH_STATUS.restoreError,
    }),
    sessionEnded: () => ({
      token: null,
      expiresAt: null,
      user: null,
      status: AUTH_STATUS.anonymous,
      notice: null,
    }),
    sessionExpired: () => ({
      token: null,
      expiresAt: null,
      user: null,
      status: AUTH_STATUS.anonymous,
      notice: "Your session has expired. Sign in again to continue.",
    }),
  },
});

export const {
  sessionEstablished,
  sessionRestored,
  sessionRestoreStarted,
  sessionRestoreFailed,
  sessionEnded,
  sessionExpired,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
