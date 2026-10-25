import { useEffect, useState } from "react";
import { SearchIcon } from "../../../shared/ui/icons/index.js";
import { FilterSelect } from "./FilterSelect.jsx";
import styles from "./PostFeed.module.css";

const defaultValues = {
  search: "",
  category: "",
  date_from: "",
  date_to: "",
  sort: "date",
  status: "",
};

export const PostFeedFilters = ({
  categories,
  initialValues,
  searchKey,
  initialValuesKey,
  canFilterStatus,
  lockCategory,
  onApply,
}) => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [showFullFilters, setShowFullFilters] = useState(
    Boolean(initialValues.date_from || initialValues.date_to),
  );

  useEffect(() => {
    setValues(initialValues);
    setError("");
    setShowFullFilters(Boolean(initialValues.date_from || initialValues.date_to));
  }, [initialValuesKey, searchKey]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (values.date_from && values.date_to && values.date_from > values.date_to) {
      setError("The start date must be on or before the end date.");
      return;
    }

    setError("");
    onApply(values);
  };

  const clearFilters = () => {
    setValues({ ...defaultValues, category: lockCategory ? values.category : "" });
    setError("");
    setShowFullFilters(false);
    onApply({ ...defaultValues, category: lockCategory ? values.category : "" });
  };

  return (
    <form className={styles.filters} onSubmit={submit}>
      <div className={styles.filterGrid}>
        <label className={styles.searchField}>
          <span className={styles.searchLabel}><SearchIcon />Search questions</span>
          <input
            type="search"
            name="search"
            value={values.search}
            onChange={updateField}
            maxLength={100}
            placeholder="Words from a title or question"
          />
        </label>
        {!lockCategory && (
          <label>
            <span>Category</span>
            <FilterSelect name="category" value={values.category} onChange={updateField}>
              <option value="">All categories</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </FilterSelect>
          </label>
        )}
        <label>
          <span>Sort by</span>
          <FilterSelect name="sort" value={values.sort} onChange={updateField}>
            <option value="date">Newest first</option>
            <option value="likes">Most liked</option>
          </FilterSelect>
        </label>
        {canFilterStatus && (
          <label>
            <span>Publication status</span>
            <FilterSelect name="status" value={values.status} onChange={updateField}>
              <option value="">All visible questions</option>
              <option value="active">Published</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
          </label>
        )}
      </div>
      <button
        className={styles.moreFilters}
        type="button"
        aria-expanded={showFullFilters}
        aria-controls="full-question-filters"
        onClick={() => setShowFullFilters((current) => !current)}
      >
        {showFullFilters ? "Fewer filters" : "More filters"}
      </button>
      <div
        className={styles.fullFilters}
        id="full-question-filters"
        hidden={!showFullFilters}
      >
        <label>
          <span>From</span>
          <input type="date" name="date_from" value={values.date_from} onChange={updateField} />
        </label>
        <label>
          <span>To</span>
          <input type="date" name="date_to" value={values.date_to} onChange={updateField} />
        </label>
      </div>
      {error && <p className={styles.validationError} role="alert">{error}</p>}
      <div className={styles.filterActions}>
        <button className="button" type="submit">Apply filters</button>
        <button className="button" type="button" onClick={clearFilters}>Clear filters</button>
      </div>
    </form>
  );
};
