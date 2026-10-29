import { ERROR_CODES } from "../constants/errorCodes.js";
import nodemailer from "nodemailer";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { storageDirectory } from "./files.js";
import { AppError } from "../errors/AppError.js";

export const createMailer = (config) => {
  const transport =
    config.mailMode === "smtp"
      ? nodemailer.createTransport({
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.port === 465,
          auth: config.smtp.user
            ? { user: config.smtp.user, pass: config.smtp.password }
            : undefined,
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        })
      : null;

  return async (email, kind, token) => {
    const message = {
      from: config.smtp.from,
      to: email,
      subject: `Usof ${kind}`,
      text:
        kind === "confirmation"
          ? `Use this link within one hour: ${config.webBaseUrl}/email-confirmation?token=${encodeURIComponent(token)}`
          : `Use this link within one hour: ${config.webBaseUrl}/reset-password?token=${encodeURIComponent(token)}`,
    };

    try {
      if (!transport) {
        const directory = join(storageDirectory, "mail");
        await mkdir(directory, { recursive: true, mode: 0o700 });
        await writeFile(join(directory, `${randomUUID()}.json`), JSON.stringify(message), {
          flag: "wx",
          mode: 0o600,
        });

        return "saved_to_local_outbox_not_sent";
      }

      const info = await transport.sendMail(message);

      if (!info.accepted.includes(email)) {
        throw new Error("Recipient rejected");
      }

      return "accepted_by_smtp";
    } catch {
      throw new AppError(
        503,
        ERROR_CODES.EMAIL_UNAVAILABLE,
        "Email delivery failed. The account operation was saved; request a new confirmation or reset link.",
      );
    }
  };
};
