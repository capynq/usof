import {
  API_URLS,
  baseApi,
  unwrapResponse,
} from "../../../shared/api/index.js";
import { reactionTags } from "../model/reactionTags.js";

const reactionUrl = (target, id) =>
  target === "post"
    ? API_URLS.posts.reactions(id)
    : API_URLS.comments.reactions(id);
export const reactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReactions: builder.query({
      query: ({ target, targetId }) => reactionUrl(target, targetId),
      transformResponse: unwrapResponse,
      providesTags: (_result, _error, { target, targetId }) => [
        { type: "ReactionList", id: `${target}-${targetId}` },
      ],
    }),
    createReaction: builder.mutation({
      query: ({ target, targetId, type }) => ({
        url: reactionUrl(target, targetId),
        method: "POST",
        body: { type },
      }),
      invalidatesTags: reactionTags,
    }),
    deleteReaction: builder.mutation({
      query: ({ target, targetId, authorId }) => ({
        url: reactionUrl(target, targetId),
        method: "DELETE",
        ...(authorId ? { params: { author_id: authorId } } : {}),
      }),
      invalidatesTags: reactionTags,
    }),
  }),
});
export const {
  useGetReactionsQuery,
  useCreateReactionMutation,
  useDeleteReactionMutation,
} = reactionsApi;
