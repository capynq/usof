import { useEffect, useState } from "react";
import { SearchIcon } from "../../../shared/ui/icons/index.js";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import styles from "./PostFeed.module.css";

const defaultValues = {
  search: "",
  category: "",
  date_from: "",
  date_to: "",
  sort: "date",
  status: "",
};

const getActiveFilters = (values, { lockCategory, isHome }) =>
  [
    !isHome && values.search.trim() ? `Search: ${values.search.trim()}` : "",
    !lockCategory && values.category ? "Category" : "",
    values.sort === "likes" ? "Most liked" : values.sort === "likes-asc" ? "Fewest likes" : "",
    values.status ? `Status: ${values.status}` : "",
    values.date_from || values.date_to ? "Date range" : "",
  ].filter(Boolean);

export const PostFeedFilters = ({
  categories,
  initialValues,
  searchKey,
  initialValuesKey,
  canFilterStatus,
  lockCategory,
  isHome,
  searchScope,
  onApply,
}) => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const activeFilters = getActiveFilters(initialValues, { lockCategory, isHome });

  useEffect(() => {
    setValues(initialValues);
    setError("");
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
    const cleared = {
      ...defaultValues,
      search: isHome ? values.search : "",
      category: lockCategory ? values.category : "",
    };
    setValues(cleared);
    setError("");
    onApply(cleared);
  };

  return (
    <form className={styles.filters} onSubmit={submit}>
      <button
        className={styles.filterToggle}
        type="button"
        aria-expanded={expanded}
        aria-controls="post-feed-filters"
        onClick={() => setExpanded((current) => !current)}
      >
        Filters{activeFilters.length > 0 ? ` (${activeFilters.length} active)` : ""}
      </button>
      {activeFilters.length > 0 && (
        <ul className={styles.activeFilters} aria-label="Active filters">
          {activeFilters.map((filter) => (
            <li key={filter}>{filter}</li>
          ))}
        </ul>
      )}
      <div id="post-feed-filters" className={styles.filterPanel} hidden={!expanded}>
        <div className={styles.filterGrid}>
          {!isHome && (
            <label className={styles.searchField}>
              <span className={styles.searchLabel}>
                <SearchIcon />
                Search {searchScope}
              </span>
              <input
                type="search"
                name="search"
                value={values.search}
                onChange={updateField}
                maxLength={100}
                placeholder="Words from a title or question"
              />
            </label>
          )}
          {!lockCategory && (
            <label>
              <span>Category</span>
              <SelectControl name="category" value={values.category} onChange={updateField}>
                <option value="">All categories</option>
                {(categories ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </SelectControl>
            </label>
          )}
          <label>
            <span>Sort by</span>
            <SelectControl name="sort" value={values.sort} onChange={updateField}>
              <option value="date">Newest first</option>
              <option value="likes">Most liked</option>
              <option value="likes-asc">Fewest likes</option>
            </SelectControl>
          </label>
          {canFilterStatus && (
            <label>
              <span>Publication status</span>
              <SelectControl name="status" value={values.status} onChange={updateField}>
                <option value="">All visible questions</option>
                <option value="active">Published</option>
                <option value="inactive">Inactive</option>
              </SelectControl>
            </label>
          )}
          <label>
            <span>From</span>
            <input type="date" name="date_from" value={values.date_from} onChange={updateField} />
          </label>
          <label>
            <span>To</span>
            <input type="date" name="date_to" value={values.date_to} onChange={updateField} />
          </label>
        </div>
        {error && (
          <p className={styles.validationError} role="alert">
            {error}
          </p>
        )}
        <div className={styles.filterActions}>
          <button className="button" type="submit">
            Apply filters
          </button>
          <button className="button" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>
    </form>
  );
};
