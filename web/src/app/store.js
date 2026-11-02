import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  authReducer,
  clearStoredSession,
  sessionEstablished,
  sessionSynced,
  sessionEnded,
  sessionExpired,
  AUTH_ENDPOINTS,
} from "../features/auth/index.js";
import { localMutationSync } from "../shared/lib/localMutationSync.js";
import {
  baseApi,
  AUTHORIZATION_HEADER,
  HTTP_STATUS,
  toBearerToken,
} from "../shared/api/index.js";

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const isLoginFailure = action.meta?.arg?.endpointName === AUTH_ENDPOINTS.login;
    const isUnauthorized = action.payload?.status === HTTP_STATUS.unauthorized ||
      action.payload?.originalStatus === HTTP_STATUS.unauthorized;
    const token = listenerApi.getState().auth.token;
    const hasSession = Boolean(token);
    const requestAuthorization = action.meta?.baseQueryMeta?.request?.headers?.get(AUTHORIZATION_HEADER);

    if (!isUnauthorized || !hasSession || isLoginFailure ||
      requestAuthorization !== toBearerToken(token)) {
      return;
    }

    clearStoredSession();
    listenerApi.dispatch(sessionExpired());
  },
});

authListener.startListening({
  matcher: isAnyOf(
    sessionEstablished,
    sessionSynced,
    sessionEnded,
    sessionExpired,
  ),
  effect: (_, { dispatch }) => {
    dispatch(baseApi.util.resetApiState());
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      localMutationSync,
      baseApi.middleware,
      authListener.middleware,
    ),
});

setupListeners(store.dispatch);
