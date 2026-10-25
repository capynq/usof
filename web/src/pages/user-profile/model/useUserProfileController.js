import { useParams, useSearchParams } from "react-router";
import { useGetPostsQuery } from "../../../entities/post/index.js";
import { useGetPublicUserQuery } from "../../../entities/user/index.js";
import { parsePositivePage, withPageParam } from "../../../shared/lib/queryParams.js";
import { PROFILE_POST_PAGE_SIZE } from "./constants.js";

export const useUserProfileController = () => {
  const { userId: rawUserId } = useParams();
  const userId = Number(rawUserId);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parsePositivePage(searchParams.get("page"));
  const isValidUserId = Number.isInteger(userId) && userId > 0;
  const userQuery = useGetPublicUserQuery(userId, { skip: !isValidUserId });
  const postsQuery = useGetPostsQuery({
    author_id: userId,
    page: currentPage,
    page_size: PROFILE_POST_PAGE_SIZE,
    sort: "date",
    summary: true,
  }, { skip: !isValidUserId });

  const changePage = (page) => {
    setSearchParams((current) => withPageParam(current, page));
  };

  return {
    isValidUserId,
    currentPage,
    changePage,
    user: userQuery.data,
    userError: userQuery.error,
    isUserLoading: userQuery.isLoading,
    posts: postsQuery.data,
    postsError: postsQuery.error,
    arePostsLoading: postsQuery.isLoading,
  };
};
