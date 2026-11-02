import { StateCompanion } from "../../../shared/ui/mascot/StateCompanion.jsx";
import styles from "./PostCollection.module.css";

export const PostCollectionEmpty = ({ message, className }) => (
  <div className={styles.slot}>
    <StateCompanion kind="empty">
      <p className={className}>{message}</p>
    </StateCompanion>
  </div>
);
