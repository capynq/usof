import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTHORIZATION_HEADER, toBearerToken } from "./headers.js";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set(AUTHORIZATION_HEADER, toBearerToken(token));
      }

      return headers;
    },
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: [
    "CurrentUser",
    "FavoriteList",
    "ReactionList",
    "AdminList",
    "Post",
    "PostList",
    "Comment",
    "CommentList",
    "Category",
    "User",
  ],
  endpoints: () => ({}),
});
