import { useLocation, useSearchParams } from "react-router";
import {
  AUTH_LINKS,
  AuthLinks,
  AuthNotice,
  AuthWindow,
} from "../../../features/auth/index.js";
import { EnvelopeIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";
import { getRegistrationMessage } from "../model/registrationMessages.js";
import { EmailConfirmationAction } from "./EmailConfirmationAction.jsx";
import { ResendConfirmationForm } from "./ResendConfirmationForm.jsx";

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const token = searchParams.get("token") ?? "";
  const registrationDelivery = location.state?.registrationDelivery;

  return (
    <AuthWindow title="Confirm your email" Icon={EnvelopeIcon}>
      <div className={styles.intro}>
        <h1>One more step</h1>
        <p>Confirm your email address before signing in to Usof.</p>
      </div>
      {registrationDelivery && (
        <AuthNotice type="success">{getRegistrationMessage(registrationDelivery)}</AuthNotice>
      )}
      {!token && !registrationDelivery && (
        <AuthNotice>Open the link from your confirmation message, or request a new one below.</AuthNotice>
      )}
      {token && <EmailConfirmationAction token={token} />}
      <ResendConfirmationForm />
      <AuthLinks links={AUTH_LINKS.emailConfirmation} />
    </AuthWindow>
  );
};
