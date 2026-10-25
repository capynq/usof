import styles from "./Pagination.module.css";
import { getPaginationItems } from "./getPaginationItems.js";

export const Pagination = ({ page, totalPages, onPageChange, label = "Pages", inline = false }) => {
  if (totalPages <= 1) return null;

  const pageItems = getPaginationItems(page, totalPages);

  return (
    <nav className={`${styles.pagination} ${inline ? styles.inline : ""}`} aria-label={label}>
      <button
        className="button"
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <ol className={styles.pages}>
        {pageItems.map((item) => (
          <li key={item}>
            {typeof item === "number" ? (
              <button
                className={`button ${item === page ? styles.current : ""}`}
                type="button"
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span aria-hidden="true">…</span>
            )}
          </li>
        ))}
      </ol>
      <button
        className="button"
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
};
