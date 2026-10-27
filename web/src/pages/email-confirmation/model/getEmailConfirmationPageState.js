import { getRegistrationMessage } from "./registrationMessages.js";

export const getEmailConfirmationPageState = ({
  token,
  registrationDelivery,
  emailChangeDeliveryFailed,
}) => ({
  token: token ?? "",
  registrationMessage: registrationDelivery
    ? getRegistrationMessage(registrationDelivery)
    : null,
  emailChangeDeliveryFailureMessage:
    emailChangeDeliveryFailed === "self"
      ? "Your email was updated, but confirmation could not be sent. Request a new link below."
      : emailChangeDeliveryFailed === "member"
        ? "The member's email was updated, but confirmation could not be sent. Request a new link below."
        : null,
  showInstructions:
    !token && !registrationDelivery && !emailChangeDeliveryFailed,
});
