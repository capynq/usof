import { formatMemberDate } from "../../../entities/user/index.js";

export const getAccountDetailValue = (user, key) => {
  if (key === "created_at") {
    return formatMemberDate(user[key]);
  }

  if (user[key] !== null && user[key] !== undefined) {
    return String(user[key]);
  }

  if (key === "rating") {
    return "0";
  }

  return "Not available";
};
