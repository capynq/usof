import { useLocation, useSearchParams } from "react-router";
import { useState } from "react";
import { AUTH_LINKS, AuthLinks, AuthNotice, AuthWindow } from "../../../features/auth/index.js";
import { isDev } from "../../../shared/config.js";
import { EnvelopeIcon } from "../../../shared/ui/icons/index.js";
import styles from "../../../features/auth/ui/AuthForm.module.css";
import { getEmailConfirmationPageState } from "../model/getEmailConfirmationPageState.js";
import { EmailConfirmationAction } from "./EmailConfirmationAction.jsx";
import { ResendConfirmationForm } from "./ResendConfirmationForm.jsx";

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [confirmationUrl, setConfirmationUrl] = useState(location.state?.confirmationUrl);
  const pageState = getEmailConfirmationPageState({
    token: searchParams.get("token"),
    registrationDelivery: location.state?.registrationDelivery,
    emailChangeDeliveryFailed: location.state?.emailChangeDeliveryFailed,
  });

  return (
    <AuthWindow title="Confirm your email" Icon={EnvelopeIcon}>
      <div className={styles.intro}>
        <h1>One more step</h1>
        <p>Confirm your email address before logging in to Usof.</p>
      </div>
      {pageState.registrationMessage && (
        <AuthNotice type="success">{pageState.registrationMessage}</AuthNotice>
      )}
      {isDev && confirmationUrl && (
        <AuthNotice>
          Development confirmation link:{" "}
          <a className={styles.confirmationUrl} href={confirmationUrl}>
            {confirmationUrl}
          </a>
        </AuthNotice>
      )}
      {pageState.emailChangeDeliveryFailureMessage && (
        <AuthNotice type="error">{pageState.emailChangeDeliveryFailureMessage}</AuthNotice>
      )}
      {pageState.showInstructions && (
        <AuthNotice>
          Open the link from your confirmation message, or request a new one below.
        </AuthNotice>
      )}
      {pageState.token && <EmailConfirmationAction token={pageState.token} />}
      {!pageState.token && (
        <ResendConfirmationForm
          registrationEmail={location.state?.registrationEmail}
          onResent={() => setConfirmationUrl(null)}
        />
      )}
      <AuthLinks links={AUTH_LINKS.emailConfirmation} />
    </AuthWindow>
  );
};
