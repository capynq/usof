import { Pagination } from "../../../shared/ui/pagination/Pagination.jsx";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import { POST_FEED_PAGE_SIZES } from "../model/postFeedQuery.js";
import styles from "./PostFeed.module.css";

export const PostFeedResultsFooter = ({
  data,
  error,
  isLoading,
  pageSize,
  onPageSizeChange,
  onPageChange,
}) => (
  <div className={styles.resultsFooter}>
    <label className={styles.pageSizeField}>
      <span>Questions per page</span>
      <SelectControl value={pageSize} onChange={onPageSizeChange}>
        {POST_FEED_PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </SelectControl>
    </label>
    {!isLoading && !error && data?.meta?.total_pages > 1 && (
      <Pagination
        page={data.meta.page}
        totalPages={data.meta.total_pages}
        onPageChange={onPageChange}
        label="Question pages"
        inline
      />
    )}
  </div>
);
