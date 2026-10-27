import { baseApi, unwrapResponse } from "../../../shared/api/index.js";

const refreshTags = [
  "AdminList",
  "User",
  "Category",
  "PostList",
  "Post",
  "Comment",
  "CommentList",
  "FavoriteList",
  "ReactionList",
  "CurrentUser",
];
export const managementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagementList: builder.query({
      query: (resource) => `/${resource}`,
      transformResponse: unwrapResponse,
      providesTags: ["AdminList"],
    }),
    saveManagementRecord: builder.mutation({
      query: ({ resource, id, body }) => ({
        url: `/${resource}${id ? `/${id}` : ""}`,
        method: id ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: refreshTags,
    }),
    deleteManagementRecord: builder.mutation({
      query: ({ resource, id }) => ({
        url: `/${resource}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: refreshTags,
    }),
  }),
});
export const {
  useGetManagementListQuery,
  useSaveManagementRecordMutation,
  useDeleteManagementRecordMutation,
} = managementApi;
