export const getErrorMessage = (error, fallback = "Usof could not complete that request.") => {
  const message = error?.data?.error?.message ?? error?.error;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (error?.status === "FETCH_ERROR") {
    return "Could not reach Usof. Check your connection and try again.";
  }

  if (error?.status === "PARSING_ERROR") {
    return "Usof returned a response the app could not read.";
  }

  return fallback;
};
