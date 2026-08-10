import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetDashboardOverviewResponse } from "../../../types/dashboard-types";

export const dashboardApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getDashboardOverview: build.query<GetDashboardOverviewResponse, void>({
            query: () => ({
                url: api.dashboard.getOverview(),
                method: "GET",
            }),
            providesTags: ['dashboard-overview'],
        }),
    }),
});

export const {
    useGetDashboardOverviewQuery,
} = dashboardApiService;
