export const API_URLS = {
  auth: {
    currentUser: "/auth/me",
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    emailConfirmation: "/auth/email-confirm",
    emailConfirmationToken: (token) =>
      `/auth/email-confirm/${encodeURIComponent(token)}`,
    passwordReset: "/auth/password-reset",
    passwordResetToken: (token) =>
      `/auth/password-reset/${encodeURIComponent(token)}`,
  },
};
