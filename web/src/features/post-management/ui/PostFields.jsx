import styles from "./PostForm.module.css";

export const PostFields = ({ values, onChange }) => (
  <>
    <label className={styles.field}>
      <span>Title</span>
      <input name="title" maxLength={200} required value={values.title} onChange={onChange} autoComplete="off" />
    </label>
    <label className={styles.field}>
      <span>Details</span>
      <textarea name="content" maxLength={50000} required rows={12} value={values.content} onChange={onChange} />
      <span className={styles.note}>Include the relevant code, what you expected, and what happened.</span>
    </label>
  </>
);
