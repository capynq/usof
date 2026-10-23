import { SESSION_STORAGE_KEY } from "./constants.js";

export const clearStoredSession = () => {
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    return;
  }
};

export const readStoredSession = () => {
  try {
    const serialized = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!serialized) {
      return null;
    }

    const session = JSON.parse(serialized);
    if (
      typeof session.token !== "string" ||
      !session.token ||
      !Number.isFinite(session.expiresAt)
    ) {
      clearStoredSession();
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      clearStoredSession();
      return { expired: true };
    }

    return session;
  } catch {
    clearStoredSession();
    return null;
  }
};

export const saveStoredSession = (token, expiresIn) => {
  const expiresAt = Date.now() + Number(expiresIn) * 1000;

  try {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ token, expiresAt }),
    );
  } catch {
    return expiresAt;
  }

  return expiresAt;
};
