export const API_URLS = {
  posts: {
    list: "/posts",
    details: (postId) => `/posts/${postId}`,
    comments: (postId) => `/posts/${postId}/comments`,
    reactions: (postId) => `/posts/${postId}/like`,
  },
  comments: {
    details: (commentId) => `/comments/${commentId}`,
    reactions: (commentId) => `/comments/${commentId}/like`,
  },
  categories: {
    list: "/categories",
  },
  users: {
    publicDetails: (userId) => `/users/${userId}`,
  },
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
