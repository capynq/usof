import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { useGetCategoriesQuery } from "../../../entities/category/index.js";
import { useGetPostsQuery } from "../../../entities/post/index.js";
import { selectCurrentUser } from "../../../features/auth/model/authSlice.js";
import {
  getPostFeedFilterParams,
  getPostFeedPageParams,
  getPostFeedPageSizeParams,
  getPostFeedQueryState,
} from "./postFeedQuery.js";

export const usePostFeedController = ({ lockedCategoryId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();
  const currentSearchParams = useMemo(() => new URLSearchParams(searchKey), [searchKey]);
  const user = useSelector(selectCurrentUser);
  const { data: categories } = useGetCategoriesQuery();
  const { filters, page, pageSize, queryArgs } = getPostFeedQueryState({
    searchParams: currentSearchParams,
    user,
    lockedCategoryId,
  });
  const postsQuery = useGetPostsQuery(queryArgs);

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
    canFilterStatus: Boolean(user),
    lockCategory: Boolean(lockedCategoryId),
    page,
    pageSize,
    postsQuery,
    applyFilters,
    changePageSize,
    changePage,
  };
};
