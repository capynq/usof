export const DATE_FORMATTERS = {
  member: new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  post: new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }),
};
