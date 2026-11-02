import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router";
import { livePollingOptions, POLLING_INTERVALS } from "../../../shared/config.js";
import { useGetCategoriesQuery } from "../../../entities/category/index.js";
import { useGetPostsQuery } from "../../../entities/post/index.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";
import { selectCurrentUser } from "../../../features/auth/model/authSlice.js";
import {
  getPostFeedFilterParams,
  getPostFeedPageParams,
  getPostFeedPageSizeParams,
  getPostFeedQueryState,
} from "./postFeedQuery.js";

export const usePostFeedController = ({ lockedCategoryId, authorId }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();
  const currentSearchParams = useMemo(() => new URLSearchParams(searchKey), [searchKey]);
  const user = useSelector(selectCurrentUser);
  const { data: categories } = useGetCategoriesQuery(
    undefined,
    livePollingOptions(POLLING_INTERVALS.categories),
  );
  const { filters, page, pageSize, queryArgs, canFilterStatus } = getPostFeedQueryState({
    searchParams: currentSearchParams,
    user,
    lockedCategoryId,
    authorId,
  });
  const postsQuery = useGetPostsQuery(
    queryArgs,
    livePollingOptions(POLLING_INTERVALS.postFeed),
  );
  const collectionKey = [searchKey, lockedCategoryId, authorId, canFilterStatus].join("|");
  const staged = useStagedCollection(postsQuery.currentData, collectionKey);
  const onRefresh = staged.hasPending ? staged.applyPending : postsQuery.refetch;

  useEffect(() => {
    const meta = staged.data?.meta;

    if (meta && !postsQuery.isFetching && page > Math.max(1, meta.total_pages)) {
      setSearchParams(getPostFeedPageParams(searchKey, Math.max(1, meta.total_pages)), {
        replace: true,
      });
    }
  }, [staged.data, postsQuery.isFetching, page, searchKey, setSearchParams]);

  const applyFilters = (values) => {
    setSearchParams(getPostFeedFilterParams(values, { lockedCategoryId, user, pageSize }));
  };

  const changePageSize = (event) => {
    setSearchParams(getPostFeedPageSizeParams(searchKey, event.currentTarget.value));
  };

  const changePage = (nextPage) => {
    setSearchParams(getPostFeedPageParams(searchKey, nextPage));
  };

  return {
    categories,
    filters,
    filtersKey: JSON.stringify(filters),
    searchKey,
    canFilterStatus,
    lockCategory: Boolean(lockedCategoryId),
    isHome: location.pathname === "/",
    searchScope: lockedCategoryId ? "this category" : authorId ? "this user" : "these questions",
    page,
    pageSize,
    displayedData: staged.data,
    pendingCount: staged.pendingCount,
    isLoading: postsQuery.isLoading,
    isFetching: postsQuery.isFetching,
    error: postsQuery.error,
    onRefresh,
    applyFilters,
    changePageSize,
    changePage,
  };
};
