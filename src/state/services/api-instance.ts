import { ENV } from "../../config/env";
import { axiosBaseQuery } from "./base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiInstance = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery({ baseUrl: ENV.BASE_URL }),
    endpoints: () => ({}),
    tagTypes: ["batches"],
});
