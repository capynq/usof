import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateComment: builder.mutation({
      query: ({ commentId, ...body }) => ({
        url: API_URLS.comments.details(commentId),
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: (_result, _error, { commentId, postId }) => [
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
        { type: "CommentList", id: postId },
        { type: "Post", id: postId },
        { type: "PostList", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
  useUpdateCommentMutation,
} = commentApi;
