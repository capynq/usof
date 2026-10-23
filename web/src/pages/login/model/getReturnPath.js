export const getReturnPath = (location) => {
  const from = location.state?.from;
  const pathname = from?.pathname;

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//")
  ) {
    return "/";
  }

  return `${pathname}${from.search ?? ""}${from.hash ?? ""}`;
};
