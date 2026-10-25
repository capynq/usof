import { getRegistrationMessage } from "./registrationMessages.js";

export const getEmailConfirmationPageState = ({ token, registrationDelivery }) => ({
  token: token ?? "",
  registrationMessage: registrationDelivery
    ? getRegistrationMessage(registrationDelivery)
    : null,
  showInstructions: !token && !registrationDelivery,
});
