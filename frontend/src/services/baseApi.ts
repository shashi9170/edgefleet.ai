import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";


const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
})


const baseQueryWithReauth: BaseQueryFn<
string | FetchArgs, unknown, FetchBaseQueryError
> = async(args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    
    if (result.error?.status === 401) {

        const r =await rawBaseQuery(
          { url: "/auth/refresh", method: "POST" },
          api, extraOptions
        );
    console.log(r);
        result = await rawBaseQuery(args, api, extraOptions);
    }
    
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Auth", "Project"],
    endpoints: () => ({}),
});