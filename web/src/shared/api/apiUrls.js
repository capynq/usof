export const API_URLS = {
  favorites: {
    list: "/favorites",
    details: (postId) => `/favorites/${postId}`,
  },
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
    details: (categoryId) => `/categories/${categoryId}`,
  },
  users: {
    publicDetails: (userId) => `/users/${userId}`,
    profile: (userId) => `/users/${userId}`,
    avatar: "/users/avatar",
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
