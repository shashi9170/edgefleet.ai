import { baseApi } from "../../services/baseApi";
import type { LoginRequest, LoginResponse, User, SignupRequest, SignupResponse } from "./auth.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<SignupResponse, SignupRequest>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;
            
                  dispatch(authApi.util.updateQueryData("getMe", undefined, () => data.user));
                } catch {}
            },
        }),


        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: '/auth/login',
                method: "POST",
                body,
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;
        
                  dispatch(authApi.util.updateQueryData("getMe", undefined, () => data.user));
                } catch { }
            },

            invalidatesTags: ["Auth", "User"],
        }),


        getMe: builder.query<User, void>({
            query: () => "/auth/me",
            providesTags: ["Auth", "User"],
        }),
      

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
      
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
              try {
                await queryFulfilled;
      
                dispatch(baseApi.util.resetApiState());
              } catch {}
            },
          }),
    })
});

export const { useSignupMutation, useLoginMutation, useGetMeQuery, useLogoutMutation, } = authApi;