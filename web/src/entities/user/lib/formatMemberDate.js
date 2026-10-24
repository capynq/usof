import { DATE_FORMATTERS, formatDate } from "../../../shared/lib/date/index.js";

export const formatMemberDate = (value) =>
  formatDate(value, DATE_FORMATTERS.member, "Not available");
