import { DATABASE_NAME_PATTERN, DECIMAL_PORT_PATTERN } from "../constants/regex.js";

export const loadConfig = (source = process.env) => {
  const required = (name) => {
    if (!source[name]?.trim()) {
      throw new Error(`Missing configuration: ${name}`);
    }

    return source[name];
  };

  const port = (name, fallback) => {
    const value = source[name] ?? String(fallback);

    if (!DECIMAL_PORT_PATTERN.test(value) || Number(value) < 1 || Number(value) > 65535) {
      throw new Error(`Invalid configuration: ${name}`);
    }

    return Number(value);
  };

  const database = required("DB_NAME");

  if (!DATABASE_NAME_PATTERN.test(database)) {
    throw new Error("DB_NAME must be usof or start with usof_");
  }

  const authSecret = required("AUTH_SECRET");

  if (authSecret.length < 32 || authSecret.startsWith("replace-")) {
    throw new Error("AUTH_SECRET must be a new random secret of at least 32 characters");
  }

  const baseUrl = new URL(required("APP_BASE_URL"));

  if (
    !["http:", "https:"].includes(baseUrl.protocol) ||
    baseUrl.username ||
    baseUrl.password ||
    baseUrl.search ||
    baseUrl.hash ||
    baseUrl.pathname !== "/"
  ) {
    throw new Error("APP_BASE_URL must be an HTTP(S) origin");
  }

  const webBaseUrl = new URL(source.WEB_BASE_URL ?? baseUrl.origin);

  if (
    !["http:", "https:"].includes(webBaseUrl.protocol) ||
    webBaseUrl.username ||
    webBaseUrl.password ||
    webBaseUrl.search ||
    webBaseUrl.hash ||
    webBaseUrl.pathname !== "/"
  ) {
    throw new Error("WEB_BASE_URL must be an HTTP(S) origin");
  }

  const production = source.NODE_ENV === "production";
  const mailMode = source.MAIL_MODE ?? (production ? "smtp" : "file");

  if (!["file", "smtp"].includes(mailMode) || (production && mailMode !== "smtp")) {
    throw new Error("MAIL_MODE must be smtp in production or file for development");
  }

  const smtp = {
    host: source.SMTP_HOST ?? "",
    port: port("SMTP_PORT", 587),
    user: source.SMTP_USER ?? "",
    password: source.SMTP_PASSWORD ?? "",
    from: required("SMTP_FROM"),
  };

  if (mailMode === "smtp" && !smtp.host) {
    throw new Error("SMTP_HOST is required for SMTP mode");
  }

  if (Boolean(smtp.user) !== Boolean(smtp.password)) {
    throw new Error("SMTP credentials must be supplied together");
  }

  return Object.freeze({
    port: port("PORT", 3000),
    production,
    development: source.NODE_ENV === "development",
    authSecret,
    baseUrl: baseUrl.origin,
    webBaseUrl: webBaseUrl.origin,
    mailMode,
    smtp,
    seedPassword: source.SEED_PASSWORD,
    db: {
      host: required("DB_HOST"),
      port: port("DB_PORT", 3306),
      user: required("DB_USER"),
      password: source.DB_PASSWORD ?? "",
      database,
    },
  });
};
