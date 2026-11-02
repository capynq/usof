export const ACCOUNT_DETAIL_LABELS = [
  { key: "login", label: "Login" },
  { key: "email", label: "Email address" },
  { key: "role", label: "Role" },
  { key: "rating", label: "Community rating" },
  { key: "created_at", label: "Member since" },
];

export const PROFILE_DETAILS_MESSAGES = {
  conflict: "Your profile was changed elsewhere. Load the current profile before saving.",
  saved: "Your profile details have been saved.",
  saveFailed: "Your profile could not be saved. Try again.",
  replaceDraft: "Loading the current profile will replace your draft.",
};

export const PROFILE_DETAILS_BUTTONS = {
  loadCurrent: "Load current profile",
  save: "Save profile",
};

export const PROFILE_FIELD_LIMITS = {
  login: { min: 3, max: 40 },
  fullName: { max: 120 },
};
