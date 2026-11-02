import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useUpdateProfileMutation } from "../../../entities/user/index.js";
import { endAuthSession } from "../../../features/auth/model/endAuthSession.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { FormFeedback } from "../../../shared/ui/form-feedback/index.js";
import { FormField } from "../../../shared/ui/form-field/index.js";
import styles from "./ProfileSettings.module.css";

export const ProfileEmailForm = ({ user }) => {
  const [email, setEmail] = useState(user.email ?? "");
  const [update, state] = useUpdateProfileMutation();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();

    if (nextEmail === user.email) {
      return;
    }

    try {
      const result = await update({
        userId: user.id,
        body: { email: nextEmail },
      }).unwrap();
      await navigate("/email-confirmation", {
        state: { registrationDelivery: result.delivery },
        flushSync: true,
      });
      endAuthSession(dispatch);
    } catch (failure) {
      if (failure.data?.error?.code === "EMAIL_UNAVAILABLE") {
        await navigate("/email-confirmation", { flushSync: true });
        endAuthSession(dispatch);
      } else {
        setError(getErrorMessage(failure, "Your email could not be changed."));
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <FormField
        id="profile-email"
        label="Email address"
        layout="stacked"
        hint="Changing your email signs you out. Confirm the new address before signing in again."
        inputProps={{
          type: "email",
          required: true,
          maxLength: 254,
          autoComplete: "email",
          value: email,
          onChange: (event) => {
            setEmail(event.target.value);
            setError("");
          },
        }}
      />
      <button
        className="button"
        type="submit"
        disabled={state.isLoading || email.trim().toLowerCase() === user.email}
      >
        {state.isLoading ? "Saving email…" : "Change email address"}
      </button>
      {error && <FormFeedback type="error">{error}</FormFeedback>}
    </form>
  );
};
