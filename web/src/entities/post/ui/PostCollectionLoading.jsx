import { LoadingIndicator } from "../../../shared/ui/loading/index.js";
import styles from "./PostCollection.module.css";

export const PostCollectionLoading = ({ completing, message }) => (
  <div className={styles.slot}>
    <LoadingIndicator completing={completing} expanded>
      {message}
    </LoadingIndicator>
  </div>
);
