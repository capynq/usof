import { API_ERROR_MESSAGES } from "./errorMessages.js";

const NETWORK_ERROR_STATUSES = new Set(["FETCH_ERROR", "TIMEOUT_ERROR"]);

export const getErrorMessage = (error, fallback = "Usof could not complete that request.") => {
  if (NETWORK_ERROR_STATUSES.has(error?.status)) {
    return API_ERROR_MESSAGES.networkUnavailable;
  }

  if (error?.status === "PARSING_ERROR") {
    return "Usof returned a response the app could not read.";
  }

  const message = error?.data?.error?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
};
