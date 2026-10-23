export const SESSION_STORAGE_KEY = "usof-session";

export const AUTH_STATUS = {
  restoring: "restoring",
  restoreError: "restore-error",
  authenticated: "authenticated",
  anonymous: "anonymous",
};

export const LOGIN_INITIAL_VALUES = {
  login: "",
  email: "",
  password: "",
};

export const REGISTER_INITIAL_VALUES = {
  login: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export const EMAIL_INITIAL_VALUES = {
  email: "",
};

export const RESET_INITIAL_VALUES = {
  new_password: "",
  password_confirmation: "",
};

export const AUTH_LINKS = {
  login: [{ to: "/register", label: "Create an account" }],
  register: [{ to: "/login", label: "Already registered? Sign in" }],
  emailConfirmation: [{ to: "/login", label: "Return to sign in" }],
  forgotPassword: [{ to: "/login", label: "Back to sign in" }],
  resetPassword: [{ to: "/login", label: "Return to sign in" }],
};
