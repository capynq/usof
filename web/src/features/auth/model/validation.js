import { EMAIL_PATTERN, LOGIN_PATTERN } from "./patterns.js";

const validateEmail = (value) => {
  const email = value.trim();

  if (!email) {
    return "Enter your email address.";
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
};

const validatePassword = (value, label = "Password") => {
  if (value.length < 8 || value.length > 128 || value.includes("\0")) {
    return `${label} must be 8 to 128 characters.`;
  }

  return null;
};

export const validateLogin = (values) => {
  const errors = {};
  const login = values.login.trim();

  if (login.length < 3 || login.length > 40 || !LOGIN_PATTERN.test(login)) {
    errors.login = "Use 3–40 letters, numbers, underscores, or hyphens.";
  }

  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const validateRegistration = (values) => {
  const errors = validateLogin(values);

  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = "The passwords do not match.";
  }

  return errors;
};

export const validateEmailRequest = (values) => {
  const emailError = validateEmail(values.email);
  return emailError ? { email: emailError } : {};
};

export const validatePasswordReset = (values) => {
  const errors = {};
  const passwordError = validatePassword(values.new_password, "New password");

  if (passwordError) {
    errors.new_password = passwordError;
  }

  if (values.new_password !== values.password_confirmation) {
    errors.password_confirmation = "The passwords do not match.";
  }

  return errors;
};
