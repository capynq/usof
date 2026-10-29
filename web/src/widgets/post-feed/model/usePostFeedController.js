import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router";
import { useGetCategoriesQuery } from "../../../entities/category/index.js";
import { useGetPostsQuery } from "../../../entities/post/index.js";
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
  const { data: categories } = useGetCategoriesQuery();
  const { filters, page, pageSize, queryArgs, canFilterStatus } = getPostFeedQueryState({
    searchParams: currentSearchParams,
    user,
    lockedCategoryId,
    authorId,
  });
  const postsQuery = useGetPostsQuery(queryArgs);

  useEffect(() => {
    const meta = postsQuery.data?.meta;

    if (meta && !postsQuery.isFetching && page > Math.max(1, meta.total_pages)) {
      setSearchParams(getPostFeedPageParams(searchKey, Math.max(1, meta.total_pages)), {
        replace: true,
      });
    }
  }, [postsQuery.data, postsQuery.isFetching, page, searchKey, setSearchParams]);

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
    postsQuery,
    applyFilters,
    changePageSize,
    changePage,
  };
};
