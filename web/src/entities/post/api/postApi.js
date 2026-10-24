import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";
import { toSearchParams } from "../../../shared/lib/queryParams.js";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (options = {}) => {
        const query = toSearchParams({
          sort: "date",
          page: 1,
          page_size: 20,
          ...options,
        });
        return `${API_URLS.posts.list}?${query}`;
      },
      providesTags: (result) => [
        { type: "PostList", id: "LIST" },
        ...(result?.data ?? []).map(({ id }) => ({ type: "Post", id })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => API_URLS.posts.details(postId),
      transformResponse: unwrapResponse,
      providesTags: (_result, _error, postId) => [{ type: "Post", id: postId }],
    }),
    createPost: builder.mutation({
      query: (body) => ({ url: API_URLS.posts.list, method: "POST", body }),
      transformResponse: unwrapResponse,
      invalidatesTags: [{ type: "PostList", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: ({ postId, ...body }) => ({
        url: API_URLS.posts.details(postId),
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: API_URLS.posts.details(postId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useGetPostsQuery,
  useUpdatePostMutation,
} = postApi;
