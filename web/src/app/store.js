import {
  configureStore,
  createListenerMiddleware,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import {
  authReducer,
  clearStoredSession,
  sessionExpired,
} from "../features/auth/index.js";
import { baseApi } from "../shared/api/index.js";

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const isLoginFailure = action.meta?.arg?.endpointName === "login";
    const isUnauthorized = action.payload?.status === 401;
    const hasSession = Boolean(listenerApi.getState().auth.token);

    if (!isUnauthorized || !hasSession || isLoginFailure) {
      return;
    }

    clearStoredSession();
    listenerApi.dispatch(sessionExpired());
    listenerApi.dispatch(baseApi.util.resetApiState());
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authListener.middleware),
});
