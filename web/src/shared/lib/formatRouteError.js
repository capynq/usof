const serializeDetails = (value) => {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2) ?? "Unknown error";
  } catch {
    return String(value);
  }
};

export const formatRouteError = (error, isRouteErrorResponse) => {
  if (isRouteErrorResponse(error)) {
    const detail = serializeDetails(error.data);

    return [`${error.status} ${error.statusText || "Route error"}`, detail]
      .filter(Boolean)
      .join("\n\n");
  }

  if (error instanceof Error) {
    return [error.name, error.message, error.stack].filter(Boolean).join("\n");
  }

  return serializeDetails(error);
};
