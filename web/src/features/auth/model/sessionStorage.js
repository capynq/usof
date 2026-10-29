import { SESSION_STORAGE_KEY } from "./constants.js";

const removeSession = (storage) => {
  try {
    storage.removeItem(SESSION_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
};

export const clearStoredSession = () => {
  let removed = false;

  try {
    removed = removeSession(window.localStorage);
  } catch {}

  try {
    if (removed) removeSession(window.sessionStorage);
    else
      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ tabLocal: true, ended: true }),
      );
  } catch {}
};

const parseSession = (serialized) => {
  try {
    const session = JSON.parse(serialized);
    if (session?.tabLocal && session.ended) return session;
    if (
      !session ||
      typeof session.token !== "string" ||
      !session.token ||
      !Number.isFinite(session.expiresAt)
    )
      return null;
    if (session.expiresAt <= Date.now()) return { expired: true, tabLocal: session.tabLocal };

    return session;
  } catch {
    return null;
  }
};

export const readStoredSession = () => {
  try {
    const fallback = parseSession(window.sessionStorage.getItem(SESSION_STORAGE_KEY));

    if (fallback?.tabLocal) {
      if (fallback.ended) return null;

      if (fallback.expired) {
        clearStoredSession();

        return fallback;
      }

      return fallback;
    }
  } catch {}

  let persistent;

  try {
    persistent = window.localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    try {
      const session = parseSession(window.sessionStorage.getItem(SESSION_STORAGE_KEY));
      if (!session || session.expired) removeSession(window.sessionStorage);

      return session;
    } catch {
      return null;
    }
  }

  if (persistent !== null) {
    try {
      removeSession(window.sessionStorage);
    } catch {}

    const session = parseSession(persistent);
    if (!session || session.expired) clearStoredSession();

    return session;
  }

  try {
    const legacy = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (legacy === null) return null;
    const session = parseSession(legacy);

    if (!session || session.expired) {
      removeSession(window.sessionStorage);

      return session;
    }

    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      removeSession(window.sessionStorage);
    } catch {
      return session;
    }

    return session;
  } catch {
    return null;
  }
};

export const saveStoredSession = (token, expiresIn) => {
  const expiresAt = Date.now() + Number(expiresIn) * 1000;

  const session = { token, expiresAt };

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    try {
      if (!removeSession(window.sessionStorage)) {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      }
    } catch {}
  } catch {
    try {
      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ ...session, tabLocal: true }),
      );
    } catch {}

    try {
      removeSession(window.localStorage);
    } catch {}
  }

  return expiresAt;
};
