import { useId } from "react";
import { getErrorMessage } from "../../../shared/api/index.js";
import styles from "./PostForm.module.css";

export const CategoryPicker = ({
  categories,
  error,
  isLoading,
  selectedIds,
  onToggle,
}) => {
  const idPrefix = useId();
  return (
    <fieldset className={styles.categories}>
      <legend>Categories</legend>
      {isLoading && <p>Loading categories…</p>}
      {!isLoading && error && (
        <p className={styles.error} role="alert">
          {getErrorMessage(error, "Categories could not be loaded.")}
        </p>
      )}
      {!isLoading && !error && categories?.length === 0 && (
        <p>No categories are available yet.</p>
      )}
      {!isLoading && !error && categories?.length > 0 && (
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <div className={styles.category} key={category.id}>
              <input
                id={`${idPrefix}-${category.id}`}
                type="checkbox"
                checked={selectedIds.includes(Number(category.id))}
                onChange={() => onToggle(Number(category.id))}
              />
              <label htmlFor={`${idPrefix}-${category.id}`}>
                {category.title}
              </label>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
};
