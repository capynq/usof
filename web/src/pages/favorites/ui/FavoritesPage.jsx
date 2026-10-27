import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { FavoriteButton } from "../../../features/favorites/ui/FavoriteButton.jsx";
import { PostCollection } from "../../../entities/post/index.js";
import { useGetFavoritesQuery } from "../../../features/favorites/api/favoritesApi.js";
import { PostFeedResultsFooter } from "../../../widgets/post-feed/ui/PostFeedResultsFooter.jsx";
import {
  POST_FEED_PAGE_SIZES,
  getPostFeedPageSizeParams,
} from "../../../widgets/post-feed/model/postFeedQuery.js";
import {
  parsePositivePage,
  withPageParam,
} from "../../../shared/lib/queryParams.js";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";

export const FavoritesPage = () => {
  const [params, setParams] = useSearchParams();
  const requestedSize = Number(params.get("page_size"));
  const pageSize = POST_FEED_PAGE_SIZES.includes(requestedSize)
    ? requestedSize
    : 20;
  const query = useGetFavoritesQuery({
    page: parsePositivePage(params.get("page")),
    page_size: pageSize,
  });
  useEffect(() => {
    const meta = query.data?.meta;
    if (
      meta &&
      !query.isFetching &&
      meta.page > Math.max(1, meta.total_pages)
    ) {
      setParams(withPageParam(params, Math.max(1, meta.total_pages)), {
        replace: true,
      });
    }
  }, [query.data, query.isFetching, params, setParams]);
  return (
    <WindowShell title="My favorites">
      <h1>Your little collection of useful questions</h1>
      <p>Saved just for you, with the most recently saved questions first.</p>
      <PostCollection
        renderActions={(post) => <FavoriteButton post={post} />}
        posts={query.data?.data}
        error={query.error}
        isLoading={query.isLoading}
        loadingMessage="Opening your favorites…"
        emptyMessage="A good question is worth keeping. Save one to find it here later."
      />
      <PostFeedResultsFooter
        data={query.data}
        error={query.error}
        isLoading={query.isLoading}
        pageSize={pageSize}
        onPageChange={(page) => setParams(withPageParam(params, page))}
        onPageSizeChange={(event) =>
          setParams(
            getPostFeedPageSizeParams(params.toString(), event.target.value),
          )
        }
      />
    </WindowShell>
  );
};
