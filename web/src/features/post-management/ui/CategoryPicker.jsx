import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "./PostForm.module.css";

export const CategoryPicker = ({ categories, error, isLoading, selectedIds, onToggle }) => (
  <fieldset className={styles.categories}>
    <legend>Categories</legend>
    {isLoading && <p>Loading categories…</p>}
    {!isLoading && error && (
      <p className={styles.error} role="alert">{getErrorMessage(error, "Categories could not be loaded.")}</p>
    )}
    {!isLoading && !error && categories?.length === 0 && <p>No categories are available yet.</p>}
    {!isLoading && !error && categories?.length > 0 && (
      <div className={styles.categoryList}>
        {categories.map((category) => (
          <label className={styles.category} key={category.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(Number(category.id))}
              onChange={() => onToggle(Number(category.id))}
            />
            <span>{category.title}</span>
          </label>
        ))}
      </div>
    )}
  </fieldset>
);
