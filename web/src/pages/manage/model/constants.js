export const EMAIL_CHANGE_NOTICE = "Email can only be changed by the member in their account settings.";

export const MANAGEMENT_RESOURCES = {
  users: "users",
  members: "members",
  categories: "categories",
  comments: "comments",
};

export const MANAGEMENT_SEARCH_MAX_LENGTH = 100;

export const USER_FIELD_LIMITS = {
  login: { min: 3, max: 40 },
  email: { max: 254 },
  fullName: { max: 120 },
  password: { min: 8, max: 128 },
};

export const USER_EDITOR_MESSAGES = {
  invalidLogin: "Use letters, digits, underscores, or hyphens for the login.",
  passwordMismatch: "Password confirmation must match.",
  saveFailed: "The member could not be saved.",
};
