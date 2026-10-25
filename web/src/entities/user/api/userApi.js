import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      invalidatesTags: (_result, _error, { userId }) => [
        "CurrentUser",
        { type: "User", id: userId },
      ],
    }),
    updateAvatar: builder.mutation({
      query: ({ formData }) => ({
        url: API_URLS.users.avatar,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: unwrapResponse,
      invalidatesTags: (_result, _error, { userId }) => [
        "CurrentUser",
        { type: "User", id: userId },
      ],
    }),
  }),
});

export const {
  useGetPublicUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = userApi;
