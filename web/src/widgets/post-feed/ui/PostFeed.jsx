import { Link } from "react-router";
import { PostCollection, useGetPostsQuery } from "../../../entities/post/index.js";
import { RECENT_POST_PAGE_SIZE } from "../model/constants.js";
import styles from "./PostFeed.module.css";

export const PostFeed = () => {
  const { data, error, isLoading } = useGetPostsQuery({
    sort: "date",
    page: 1,
    page_size: RECENT_POST_PAGE_SIZE,
    summary: true,
  });

  return (
    <section className={styles.feed} aria-labelledby="recent-posts-title">
      <div className={styles.heading}>
        <h2 id="recent-posts-title">Recent questions</h2>
        <Link to="/posts/new">Ask a question</Link>
      </div>
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
    </section>
  );
};
