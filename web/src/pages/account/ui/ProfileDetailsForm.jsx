import { useProfileDetailsForm } from "../model/useProfileDetailsForm.js";
import {
  PROFILE_DETAILS_BUTTONS,
  PROFILE_DETAILS_MESSAGES,
  PROFILE_FIELD_LIMITS,
} from "../model/constants.js";
import { LOGIN_PATTERN } from "../../../shared/lib/regexPatterns.js";
import { FormFeedback } from "../../../shared/ui/form-feedback/index.js";
import { FormField } from "../../../shared/ui/form-field/index.js";
import styles from "./ProfileSettings.module.css";

export const ProfileDetailsForm = ({ user }) => {
  const { values, notice, busy, conflict, updateField, saveProfile, reloadProfile } =
    useProfileDetailsForm(user);

  return (
    <form className={styles.form} onSubmit={saveProfile}>
      <FormField
        id="profile-login"
        label="Login"
        layout="stacked"
        className={styles.field}
        inputProps={{
          disabled: busy,
          name: "login",
          value: values.login,
          onChange: updateField,
          autoComplete: "username",
          pattern: LOGIN_PATTERN.source,
          title: "Use letters, numbers, underscores, or hyphens.",
          minLength: PROFILE_FIELD_LIMITS.login.min,
          maxLength: PROFILE_FIELD_LIMITS.login.max,
          required: true,
        }}
      />
      <FormField
        id="profile-full-name"
        label="Display name"
        layout="stacked"
        className={styles.field}
        inputProps={{
          disabled: busy,
          name: "full_name",
          value: values.full_name,
          onChange: updateField,
          autoComplete: "name",
          maxLength: PROFILE_FIELD_LIMITS.fullName.max,
        }}
      />
      {conflict && (
        <div>
          <p>{PROFILE_DETAILS_MESSAGES.replaceDraft}</p>
          <button className="button" type="button" disabled={busy} onClick={reloadProfile}>
            {PROFILE_DETAILS_BUTTONS.loadCurrent}
          </button>
        </div>
      )}
      <button className="button" type="submit" disabled={busy}>
        {PROFILE_DETAILS_BUTTONS.save}
      </button>
      {notice && <FormFeedback type={notice.type}>{notice.message}</FormFeedback>}
    </form>
  );
};
