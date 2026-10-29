import styles from "./StatusBadge.module.css";

const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  removed: "Removed",
};

export const StatusBadge = ({ status }) => {
  const label = STATUS_LABELS[status];

  if (!label) {
    return null;
  }

  return <span className={`${styles.badge} ${styles[status]}`}>{label}</span>;
};
