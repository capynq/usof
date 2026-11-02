export const getProfileValues = (user) => ({
  login: user.login ?? "",
  full_name: user.full_name ?? "",
});

export const sameProfileValues = (left, right) =>
  left.login === right.login && left.full_name === right.full_name;
