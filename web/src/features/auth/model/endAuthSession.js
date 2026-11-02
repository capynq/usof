import { sessionEnded } from "./authSlice.js";
import { clearStoredSession } from "./sessionStorage.js";

export const endAuthSession = (dispatch, action = sessionEnded()) => {
  clearStoredSession();
  dispatch(action);
};
