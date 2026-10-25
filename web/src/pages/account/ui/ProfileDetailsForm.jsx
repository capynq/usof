import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sessionRestored } from "../../../features/auth/model/authSlice.js";
import { useUpdateProfileMutation } from "../../../entities/user/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { FormFeedback } from "../../../shared/ui/form-feedback/index.js";
import { FormField } from "../../../shared/ui/form-field/index.js";
import styles from "./ProfileSettings.module.css";

const getProfileValues = (user) => ({
  login: user.login ?? "",
  full_name: user.full_name ?? "",
});

export const ProfileDetailsForm = ({ user }) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState(() => getProfileValues(user));
  const [notice, setNotice] = useState(null);
  const [updateProfile, profileState] = useUpdateProfileMutation();

  useEffect(() => {
    setValues(getProfileValues(user));
  }, [user.login, user.full_name]);

  const updateField = (event) => {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice(null);

    try {
      const updatedUser = await updateProfile({
        userId: user.id,
        body: {
          login: values.login.trim(),
          full_name: values.full_name.trim(),
        },
      }).unwrap();
      dispatch(sessionRestored(updatedUser));
      setNotice({ type: "success", message: "Your profile details have been saved." });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Your profile could not be saved."),
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={saveProfile}>
      <FormField
        id="profile-login"
        label="Login"
        layout="stacked"
        className={styles.field}
        inputProps={{
          name: "login",
          value: values.login,
          onChange: updateField,
          autoComplete: "username",
          minLength: 3,
          maxLength: 40,
          required: true,
        }}
      />
      <FormField
        id="profile-full-name"
        label="Display name"
        layout="stacked"
        className={styles.field}
        inputProps={{
          name: "full_name",
          value: values.full_name,
          onChange: updateField,
          autoComplete: "name",
          maxLength: 120,
        }}
      />
      {notice && <FormFeedback type={notice.type}>{notice.message}</FormFeedback>}
      <button className="button" type="submit" disabled={profileState.isLoading}>
        Save profile
      </button>
    </form>
  );
};
