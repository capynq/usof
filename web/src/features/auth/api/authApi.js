import { API_URLS, baseApi, unwrapResponse } from "../../../shared/api/index.js";
import { sessionEstablished } from "../model/authSlice.js";
import { endAuthSession } from "../model/endAuthSession.js";
import { saveStoredSession } from "../model/sessionStorage.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => API_URLS.auth.currentUser,
      transformResponse: unwrapResponse,
      providesTags: ["CurrentUser"],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: API_URLS.auth.login,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const expiresAt = saveStoredSession(data.token, data.expires_in);
          dispatch(sessionEstablished({ ...data, expiresAt }));
        } catch {
          return;
        }
      },
    }),
    register: builder.mutation({
      query: (body) => ({
        url: API_URLS.auth.register,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.auth.logout,
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled.catch(() => undefined);
        endAuthSession(dispatch);
      },
    }),
    confirmEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.auth.emailConfirmationToken(token),
        method: "GET",
      }),
      transformResponse: unwrapResponse,
    }),
    resendConfirmation: builder.mutation({
      query: (body) => ({
        url: API_URLS.auth.emailConfirmation,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
    }),
    requestPasswordReset: builder.mutation({
      query: (body) => ({
        url: API_URLS.auth.passwordReset,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
    }),
    resetPassword: builder.mutation({
      query: ({ token, new_password }) => ({
        url: API_URLS.auth.passwordResetToken(token),
        method: "POST",
        body: { new_password },
      }),
      transformResponse: unwrapResponse,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          endAuthSession(dispatch);
        } catch {
          return;
        }
      },
    }),
  }),
});

export const {
  useConfirmEmailMutation,
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResendConfirmationMutation,
  useResetPasswordMutation,
} = authApi;
