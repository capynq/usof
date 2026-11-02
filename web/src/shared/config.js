export const isDev = import.meta.env.DEV;

const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

export const SESSION_RESTORE_TIMEOUT_MS = DEFAULT_REQUEST_TIMEOUT_MS;

export const REFRESH_HIGHLIGHT_MS = 300;

export const MIN_LOADING_COMPLETE_MS = 300;

export const MIN_LOADING_VISIBLE_MS = 500;

const DEFAULT_POLLING_INTERVAL_MS = 15000;

export const POLLING_INTERVALS = {
  postDetails: DEFAULT_POLLING_INTERVAL_MS,
  reactions: DEFAULT_POLLING_INTERVAL_MS,
  categories: DEFAULT_POLLING_INTERVAL_MS,
  postFeed: DEFAULT_POLLING_INTERVAL_MS,
  comments: DEFAULT_POLLING_INTERVAL_MS,
  favorites: DEFAULT_POLLING_INTERVAL_MS,
  managementUsers: DEFAULT_POLLING_INTERVAL_MS,
  managementCategories: DEFAULT_POLLING_INTERVAL_MS,
  managementComments: DEFAULT_POLLING_INTERVAL_MS,
};

export const livePollingOptions = (pollingInterval) => ({
  pollingInterval,
  skipPollingIfUnfocused: true,
});

export const PROFILE_SAVE_CHECK_TIMEOUT_MS = DEFAULT_REQUEST_TIMEOUT_MS;
