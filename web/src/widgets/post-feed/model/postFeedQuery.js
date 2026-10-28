import {
  CATEGORY_ID_PATTERN,
  DATE_ONLY_PATTERN,
} from "../../../shared/lib/regexPatterns.js";
import {
  parsePositivePage,
  toSearchParams,
  withPageParam,
} from "../../../shared/lib/queryParams.js";
import { RECENT_POST_PAGE_SIZE } from "./constants.js";

export const POST_FEED_PAGE_SIZES = [10, 20, 50, 100];

const isDate = (value) => {
  if (!DATE_ONLY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

const readFilters = (searchParams, canFilterStatus) => {
  const rawCategory = searchParams.get("category") ?? "";
  const requestedStatus = searchParams.get("status");
  const status =
    canFilterStatus && ["active", "inactive"].includes(requestedStatus)
      ? requestedStatus
      : "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";

  return {
    search: (searchParams.get("search") ?? "").slice(0, 100),
    category: CATEGORY_ID_PATTERN.test(rawCategory) ? rawCategory : "",
    date_from: isDate(dateFrom) ? dateFrom : "",
    date_to: isDate(dateTo) ? dateTo : "",
    sort: searchParams.get("sort") === "likes"
      ? searchParams.get("direction") === "asc" ? "likes-asc" : "likes"
      : "date",
    status,
  };
};

export const getPostFeedQueryState = ({
  searchParams,
  user,
  lockedCategoryId,
  authorId,
}) => {
  const page = parsePositivePage(searchParams.get("page"));
  const requestedPageSize = Number(searchParams.get("page_size"));
  const pageSize = POST_FEED_PAGE_SIZES.includes(requestedPageSize)
    ? requestedPageSize
    : RECENT_POST_PAGE_SIZE;
  const canFilterStatus = Boolean(
    user &&
    (!authorId ||
      Number(user.id) === Number(authorId) ||
      user.role === "admin"),
  );
  const filters = readFilters(searchParams, canFilterStatus);
  const categoryId =
    lockedCategoryId ??
    (filters.category ? Number(filters.category) : undefined);

  const queryArgs = {
    sort: filters.sort === "date" ? "date" : "likes",
    ...(filters.sort === "likes-asc" ? { direction: "asc" } : {}),
    page,
    page_size: pageSize,
    summary: true,
    ...(authorId ? { author_id: authorId } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    ...(categoryId ? { categories: [categoryId] } : {}),
    ...(filters.date_from ? { date_from: filters.date_from } : {}),
    ...(filters.date_to ? { date_to: filters.date_to } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return { filters, page, pageSize, queryArgs, canFilterStatus };
};

export const getPostFeedFilterParams = (
  values,
  { lockedCategoryId, user, pageSize },
) =>
  new URLSearchParams(
    toSearchParams({
      search: values.search.trim(),
      category: lockedCategoryId ? undefined : values.category,
      date_from: values.date_from,
      date_to: values.date_to,
      sort: values.sort === "likes" || values.sort === "likes-asc" ? "likes" : undefined,
      direction: values.sort === "likes-asc" ? "asc" : undefined,
      status: user ? values.status : undefined,
      page_size:
        pageSize === RECENT_POST_PAGE_SIZE ? undefined : String(pageSize),
    }),
  );

export const getPostFeedPageSizeParams = (searchKey, nextPageSize) => {
  const params = new URLSearchParams(searchKey);
  params.delete("page");

  if (Number(nextPageSize) === RECENT_POST_PAGE_SIZE) {
    params.delete("page_size");
  } else {
    params.set("page_size", nextPageSize);
  }

  return params;
};

export const getPostFeedPageParams = (searchKey, page) =>
  withPageParam(new URLSearchParams(searchKey), page);
