import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicUser: builder.query({
      query: (userId) => API_URLS.users.publicDetails(userId),
      transformResponse: unwrapResponse,
    }),
  }),
});

export const { useGetPublicUserQuery } = userApi;
