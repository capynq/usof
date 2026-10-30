import { useId } from "react";
import { POST_STATUS_OPTIONS } from "../model/constants.js";
import styles from "./PostForm.module.css";

export const AdminPostControls = ({ post, isOwner, status, onChange }) => {
  const statusId = useId();

  return (
  <>
    {!isOwner && (
      <section className={styles.readOnlyPost} aria-label="Post content">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </section>
    )}
    <fieldset className={styles.categories}>
      <legend>Publication status</legend>
      <div className={styles.categoryList}>
        {POST_STATUS_OPTIONS.map((option) => (
          <div className={styles.statusOption} key={option.value}>
            <input id={`${statusId}-${option.value}`} type="radio" name="status" value={option.value} checked={status === option.value} onChange={onChange} />
            <label htmlFor={`${statusId}-${option.value}`}><span className={styles[option.value]}>{option.label}</span></label>
          </div>
        ))}
      </div>
    </fieldset>
  </>
  );
};
