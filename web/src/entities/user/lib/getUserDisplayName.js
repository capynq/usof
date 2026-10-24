export const getUserDisplayName = (user, fallback = "Unknown author") =>
  user?.full_name || user?.login || fallback;
