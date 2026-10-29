import { POST_STATUS_OPTIONS } from "../model/constants.js";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import styles from "./PostForm.module.css";

export const AdminPostControls = ({ post, status, onChange }) => (
  <>
    <section className={styles.readOnlyPost} aria-label="Post content">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p className={styles.note}>
        Administrators can change categories and publication status here.
      </p>
    </section>
    <label className={styles.field}>
      <span>Publication status</span>
      <SelectControl name="status" value={status} onChange={onChange}>
        {POST_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectControl>
    </label>
  </>
);
