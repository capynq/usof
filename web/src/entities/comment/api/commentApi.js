import {
  API_URLS,
  baseApi,
  unwrapResponse,
} from "../../../shared/api/index.js";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComment: builder.query({
      query: (id) => API_URLS.comments.details(id),
      transformResponse: unwrapResponse,
      providesTags: (_result, _error, id) => [{ type: "Comment", id }],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, status, content }) => ({
        url: API_URLS.comments.details(commentId),
        method: "PATCH",
        body: status !== undefined ? { status } : { content },
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: (_result, _error, { commentId, postId }) => [
        "AdminList",
        "FavoriteList",
        "User",
        "CurrentUser",
        { type: "Comment", id: commentId },
        { type: "CommentList", id: postId },
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: API_URLS.comments.details(commentId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { commentId, postId }) => [
        "AdminList",
        "FavoriteList",
        "User",
        "CurrentUser",
        { type: "Comment", id: commentId },
        { type: "CommentList", id: postId },
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
    getPostComments: builder.query({
      query: (postId) => API_URLS.posts.comments(postId),
      transformResponse: unwrapResponse,
      providesTags: (result, _error, postId) => [
        { type: "CommentList", id: postId },
        ...(result ?? []).map(({ id }) => ({ type: "Comment", id })),
      ],
    }),
    createComment: builder.mutation({
      query: ({ postId, ...body }) => ({
        url: API_URLS.posts.comments(postId),
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: (_result, _error, { postId }) => [
        "AdminList",
        "FavoriteList",
        "User",
        "CurrentUser",
        { type: "CommentList", id: postId },
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCommentQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
  useUpdateCommentMutation,
} = commentApi;
