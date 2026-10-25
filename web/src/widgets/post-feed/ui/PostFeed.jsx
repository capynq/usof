import { Link } from "react-router";
import { PostCollection } from "../../../entities/post/index.js";
import { PostFeedFilters } from "./PostFeedFilters.jsx";
import { PostFeedResultsFooter } from "./PostFeedResultsFooter.jsx";
import { usePostFeedController } from "../model/usePostFeedController.js";
import styles from "./PostFeed.module.css";

export const PostFeed = ({ lockedCategoryId, heading = "Recent questions" }) => {
  const feed = usePostFeedController({ lockedCategoryId });
  const { data, error, isLoading } = feed.postsQuery;

  return (
    <section className={styles.feed} aria-labelledby="recent-posts-title">
      <div className={styles.heading}>
        <h2 id="recent-posts-title">{heading}</h2>
        <Link to="/posts/new">Ask a question</Link>
      </div>
      <PostFeedFilters
        categories={feed.categories}
        initialValues={feed.filters}
        searchKey={feed.searchKey}
        initialValuesKey={feed.filtersKey}
        canFilterStatus={feed.canFilterStatus}
        lockCategory={feed.lockCategory}
        onApply={feed.applyFilters}
      />
      <PostCollection
        posts={data?.data}
        error={error}
        isLoading={isLoading}
        loadingMessage="Loading recent questions…"
        emptyMessage="No questions have been published yet. Start the first discussion."
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
