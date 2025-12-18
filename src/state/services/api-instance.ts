import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./base-query";
import { ENV } from "../../config/env";

export const apiInstance = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery({ baseUrl: ENV.BASE_URL }),
    endpoints: () => ({}),
    tagTypes: [],
});



