const REGISTRATION_DELIVERY_MESSAGES = {
  saved_to_local_outbox_not_sent:
    "Your account is ready. The confirmation message was saved in the private development outbox; no email was sent.",
  accepted_by_smtp:
    "Your account is ready. A confirmation message was accepted for delivery.",
};

export const getRegistrationMessage = (delivery) => {
  if (Object.hasOwn(REGISTRATION_DELIVERY_MESSAGES, delivery)) {
    return REGISTRATION_DELIVERY_MESSAGES[delivery];
  }

  return "Your account is ready. Confirm your email before signing in.";
};
