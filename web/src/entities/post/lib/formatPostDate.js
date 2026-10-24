import { DATE_FORMATTERS, formatDate } from "../../../shared/lib/date/index.js";

export const formatPostDate = (value) =>
  formatDate(value, DATE_FORMATTERS.post);
