import { useState } from "react";
import { useDispatch } from "react-redux";
import { sessionRestored } from "../../../features/auth/model/authSlice.js";
import { useUpdateAvatarMutation } from "../../../entities/user/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { FormFeedback } from "../../../shared/ui/form-feedback/index.js";
import { FormField } from "../../../shared/ui/form-field/index.js";
import styles from "./ProfileSettings.module.css";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export const ProfileAvatarForm = ({ user }) => {
  const dispatch = useDispatch();
  const [notice, setNotice] = useState(null);
  const [updateAvatar, avatarState] = useUpdateAvatarMutation();

  const saveAvatar = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const avatar = form.elements.namedItem("avatar")?.files?.[0];
    setNotice(null);

    if (!avatar) {
      setNotice({ type: "error", message: "Choose a JPEG, PNG, or WebP image first." });
      return;
    }
    if (avatar.size > MAX_AVATAR_SIZE) {
      setNotice({ type: "error", message: "The image must be 2 MB or smaller." });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const updatedUser = await updateAvatar({ userId: user.id, formData }).unwrap();
      dispatch(sessionRestored(updatedUser));
      form.reset();
      setNotice({ type: "success", message: "Your profile picture has been updated." });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Your profile picture could not be updated."),
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={saveAvatar}>
      <FormField
        id="profile-avatar"
        label="Profile picture"
        layout="stacked"
        className={styles.field}
        hint="JPEG, PNG, or WebP. Maximum size: 2 MB."
        inputProps={{
          name: "avatar",
          type: "file",
          accept: "image/jpeg,image/png,image/webp",
        }}
      />
      {notice && <FormFeedback type={notice.type}>{notice.message}</FormFeedback>}
      <button className="button" type="submit" disabled={avatarState.isLoading}>
        {avatarState.isLoading ? "Uploading…" : "Upload picture"}
      </button>
    </form>
  );
};
