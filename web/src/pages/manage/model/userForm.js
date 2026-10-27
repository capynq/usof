export const EMPTY_USER_VALUES = Object.freeze({
  login: "",
  email: "",
  full_name: "",
  role: "user",
  password: "",
  password_confirmation: "",
});

export const getInitialUserValues = (record) =>
  record
    ? {
        login: record.login ?? "",
        email: record.email ?? "",
        full_name: record.full_name ?? "",
        role: record.role ?? "user",
        password: "",
        password_confirmation: "",
      }
    : { ...EMPTY_USER_VALUES };

export const buildUserPayload = (values, isCreating) => {
  const { password, password_confirmation, ...profile } = values;

  return {
    ...profile,
    login: profile.login.trim(),
    email: profile.email.trim().toLowerCase(),
    full_name: profile.full_name.trim(),
    ...(isCreating ? { password, password_confirmation } : {}),
  };
};
