import styles from "./FormFeedback.module.css";

const FEEDBACK_ROLES = {
  error: "alert",
  info: "status",
  success: "status",
};

export const FormFeedback = ({ children, type = "info" }) => {
  const feedbackType = Object.hasOwn(FEEDBACK_ROLES, type) ? type : "info";

  return (
    <div className={`${styles.feedback} ${styles[feedbackType]}`} role={FEEDBACK_ROLES[feedbackType]}>
      {children}
    </div>
  );
};
