import { API_URLS, baseApi } from "../../../shared/api/index.js";

export const reactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReaction: builder.mutation({
      query: ({ target, targetId, type }) => ({
        url:
          target === "post"
            ? API_URLS.posts.reactions(targetId)
            : API_URLS.comments.reactions(targetId),
        method: "POST",
        body: { type },
      }),
      invalidatesTags: (_result, _error, { target, targetId, postId }) => {
        if (target === "post") {
          return [
            { type: "Post", id: targetId },
            { type: "PostList", id: "LIST" }
          ];
        }

        return [
          { type: "Comment", id: targetId },
          { type: "CommentList", id: postId },
          { type: "Post", id: postId },
        ];
      },
    }),
    deleteReaction: builder.mutation({
      query: ({ target, targetId }) => ({
        url:
          target === "post"
            ? API_URLS.posts.reactions(targetId)
            : API_URLS.comments.reactions(targetId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { target, targetId, postId, skipRefresh }) => {
        if (skipRefresh) {
          return [];
        }

        if (target === "post") {
          return [
            { type: "Post", id: targetId },
            { type: "PostList", id: "LIST" },
          ];
        }

        return [
          { type: "Comment", id: targetId },
          { type: "CommentList", id: postId },
          { type: "Post", id: postId },
        ];
      },
    }),
  }),
});

export const { useCreateReactionMutation, useDeleteReactionMutation } =
  reactionsApi;
