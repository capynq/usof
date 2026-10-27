import {
  API_URLS,
  baseApi,
  unwrapResponse,
} from "../../../shared/api/index.js";

const profileTags = (_result, _error, { userId, body }) => [
  ...(body?.email ? [] : ["CurrentUser"]),
  { type: "User", id: userId },
  "Post",
  "PostList",
  "Comment",
  "CommentList",
  "ReactionList",
  "FavoriteList",
  "AdminList",
];

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteOwnAccount: builder.mutation({
      query: (id) => ({ url: API_URLS.users.profile(id), method: "DELETE" }),
    }),
    getPublicUser: builder.query({
      query: (userId) => API_URLS.users.publicDetails(userId),
      transformResponse: unwrapResponse,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),
    updateProfile: builder.mutation({
      query: ({ userId, body }) => ({
        url: API_URLS.users.profile(userId),
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: profileTags,
    }),
    updateAvatar: builder.mutation({
      query: ({ formData }) => ({
        url: API_URLS.users.avatar,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: profileTags,
    }),
  }),
});

export const {
  useDeleteOwnAccountMutation,
  useGetPublicUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = userApi;
