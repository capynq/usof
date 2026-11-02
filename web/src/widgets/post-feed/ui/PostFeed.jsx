import { FavoriteButton } from "../../../features/favorites/ui/FavoriteButton.jsx";
import { PostCollection } from "../../../entities/post/index.js";
import { PostFeedFilters } from "./PostFeedFilters.jsx";
import { PostFeedResultsFooter } from "./PostFeedResultsFooter.jsx";
import { usePostFeedController } from "../model/usePostFeedController.js";
import { RECENT_QUESTIONS_HEADING } from "../model/constants.js";
import { RefreshControl } from "../../../shared/ui/refresh-control/index.js";
import styles from "./PostFeed.module.css";

export const PostFeed = ({ lockedCategoryId, authorId, heading = RECENT_QUESTIONS_HEADING }) => {
  const feed = usePostFeedController({ lockedCategoryId, authorId });
  const { error, isLoading } = feed;
  const headingId = heading ? "recent-posts-title" : undefined;

  return (
    <section
      className={styles.feed}
      aria-label={heading ? undefined : RECENT_QUESTIONS_HEADING}
      aria-labelledby={headingId}
    >
      <div className={styles.heading}>
        {heading ? (
          <h2 id={headingId} title={heading}>
            {heading}
          </h2>
        ) : (
          <span>{RECENT_QUESTIONS_HEADING}</span>
        )}
        <RefreshControl
          onClick={feed.onRefresh}
          isFetching={feed.isFetching}
          pendingCount={feed.pendingCount}
          error={error}
        />
      </div>
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
        posts={feed.displayedData?.data}
        error={error}
        isLoading={isLoading}
        loadingMessage="Loading recent questions…"
        emptyMessage="No questions match these filters. Try a different search or clear the filters."
        listClassName={styles.list}
        stateClassName={styles.state}
        errorClassName={styles.error}
      />
      <PostFeedResultsFooter
        data={feed.displayedData}
        error={error}
        isLoading={isLoading}
        pageSize={feed.pageSize}
        onPageSizeChange={feed.changePageSize}
        onPageChange={feed.changePage}
      />
    </section>
  );
};
