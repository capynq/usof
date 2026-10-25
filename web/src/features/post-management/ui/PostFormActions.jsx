import styles from "./PostForm.module.css";

export const PostFormActions = ({ isEditing, isSaving, isDisabled, onCancel }) => (
  <div className={styles.actions}>
    <button className={`button ${styles.save}`} type="submit" disabled={isDisabled || isSaving}>
      {isSaving ? "Saving…" : isEditing ? "Save changes" : "Publish question"}
    </button>
    <button className="button" type="button" disabled={isSaving} onClick={onCancel}>
      Cancel
    </button>
  </div>
);
