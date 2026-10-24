import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => API_URLS.categories.list,
      transformResponse: unwrapResponse,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
