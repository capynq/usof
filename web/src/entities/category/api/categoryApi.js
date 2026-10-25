import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => API_URLS.categories.list,
      transformResponse: unwrapResponse,
      providesTags: ["Category"],
    }),
    getCategory: builder.query({
      query: (categoryId) => API_URLS.categories.details(categoryId),
      transformResponse: unwrapResponse,
      providesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
      ],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoryApi;
