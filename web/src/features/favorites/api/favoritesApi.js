import { API_URLS, baseApi } from "../../../shared/api/index.js";
import { toSearchParams } from "../../../shared/lib/queryParams.js";

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: (options) =>
        `${API_URLS.favorites.list}?${toSearchParams(options)}`,
      providesTags: ["FavoriteList"],
    }),
    setFavorite: builder.mutation({
      query: ({ postId, saved }) => ({
        url: API_URLS.favorites.details(postId),
        method: saved ? "PUT" : "DELETE",
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        "FavoriteList",
        { type: "Post", id: postId },
        "PostList",
      ],
    }),
  }),
});
export const { useGetFavoritesQuery, useSetFavoriteMutation } = favoritesApi;
