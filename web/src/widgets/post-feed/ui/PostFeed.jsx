import { FavoriteButton } from "../../../features/favorites/ui/FavoriteButton.jsx";
import { PostCollection } from "../../../entities/post/index.js";
import { PostFeedFilters } from "./PostFeedFilters.jsx";
import { PostFeedResultsFooter } from "./PostFeedResultsFooter.jsx";
import { usePostFeedController } from "../model/usePostFeedController.js";
import styles from "./PostFeed.module.css";

export const PostFeed = ({ lockedCategoryId, authorId, heading = "Recent questions" }) => {
  const feed = usePostFeedController({ lockedCategoryId, authorId });
  const { data, error, isLoading } = feed.postsQuery;
  const headingId = heading ? "recent-posts-title" : undefined;

  return (
    <section
      className={styles.feed}
      aria-label={heading ? undefined : "Recent questions"}
      aria-labelledby={headingId}
    >
      {heading && (
        <div className={styles.heading}>
          <h2 id={headingId}>{heading}</h2>
        </div>
      )}
      <PostFeedFilters
        categories={feed.categories}
        initialValues={feed.filters}
        searchKey={feed.searchKey}
        initialValuesKey={feed.filtersKey}
        canFilterStatus={feed.canFilterStatus}
        lockCategory={feed.lockCategory}
        isHome={feed.isHome}
        searchScope={feed.searchScope}
        onApply={feed.applyFilters}
      />
      <PostCollection
        renderActions={(post) => <FavoriteButton post={post} />}
        posts={data?.data}
        error={error}
        isLoading={isLoading}
        loadingMessage="Loading recent questions…"
        emptyMessage="No questions match these filters. Try a different search or clear the filters."
        listClassName={styles.list}
        stateClassName={styles.state}
        errorClassName={styles.error}
      />
      <PostFeedResultsFooter
        data={data}
        error={error}
        isLoading={isLoading}
        pageSize={feed.pageSize}
        onPageSizeChange={feed.changePageSize}
        onPageChange={feed.changePage}
      />
    </section>
  );
};
