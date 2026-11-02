import { StateCompanion } from "../../../shared/ui/mascot/StateCompanion.jsx";
import styles from "./PostCollection.module.css";

export const PostCollectionError = ({ message, className }) => (
  <div className={styles.slot}>
    <StateCompanion kind="error">
      <p className={className} role="alert">
        {message}
      </p>
    </StateCompanion>
  </div>
);
