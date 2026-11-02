import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { POLLING_INTERVALS, livePollingOptions } from "../../../shared/config.js";
import { FavoriteButton } from "../../../features/favorites/ui/FavoriteButton.jsx";
import { PostCollection } from "../../../entities/post/index.js";
import { useGetFavoritesQuery } from "../../../features/favorites/api/favoritesApi.js";
import { PostFeedResultsFooter } from "../../../widgets/post-feed/ui/PostFeedResultsFooter.jsx";
import {
  POST_FEED_PAGE_SIZES,
  getPostFeedPageSizeParams,
} from "../../../widgets/post-feed/model/postFeedQuery.js";
import { parsePositivePage, withPageParam } from "../../../shared/lib/queryParams.js";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { RefreshControl } from "../../../shared/ui/refresh-control/index.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";
import { FAVORITES_PAGE_COPY, FAVORITES_PAGE_SIZE } from "../model/constants.js";
import styles from "./FavoritesPage.module.css";

export const FavoritesPage = () => {
  const [params, setParams] = useSearchParams();
  const requestedSize = Number(params.get("page_size"));
  const pageSize = POST_FEED_PAGE_SIZES.includes(requestedSize)
    ? requestedSize
    : FAVORITES_PAGE_SIZE;
  const query = useGetFavoritesQuery(
    {
      page: parsePositivePage(params.get("page")),
      page_size: pageSize,
    },
    livePollingOptions(POLLING_INTERVALS.favorites),
  );
  const staged = useStagedCollection(query.currentData, params.toString());
  const onRefresh = staged.hasPending ? staged.applyPending : query.refetch;
  useEffect(() => {
    const meta = staged.data?.meta;

    if (meta && !query.isFetching && meta.page > Math.max(1, meta.total_pages)) {
      setParams(withPageParam(params, Math.max(1, meta.total_pages)), {
        replace: true,
      });
    }
  }, [staged.data, query.isFetching, params, setParams]);

  return (
    <WindowShell title={FAVORITES_PAGE_COPY.title}>
      <div className={styles.headingRow}>
        <h1>{FAVORITES_PAGE_COPY.heading}</h1>
        <RefreshControl
          onClick={onRefresh}
          isFetching={query.isFetching}
          pendingCount={staged.pendingCount}
          error={staged.data?.data?.length ? query.error : null}
        />
      </div>
      <p>{FAVORITES_PAGE_COPY.intro}</p>
      <PostCollection
        renderActions={(post) => <FavoriteButton post={post} />}
        posts={staged.data?.data}
        error={query.error}
        isLoading={query.isLoading}
        loadingMessage={FAVORITES_PAGE_COPY.loading}
        emptyMessage={FAVORITES_PAGE_COPY.empty}
      />
      <PostFeedResultsFooter
        data={staged.data}
        error={query.error}
        isLoading={query.isLoading}
        pageSize={pageSize}
        onPageChange={(page) => setParams(withPageParam(params, page))}
        onPageSizeChange={(event) =>
          setParams(getPostFeedPageSizeParams(params.toString(), event.target.value))
        }
      />
    </WindowShell>
  );
};
