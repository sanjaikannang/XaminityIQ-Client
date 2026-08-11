import type { AsyncSelectOption } from "../common/ui/AsyncSelect";

type Additional = { page: number };
type LoadResult = { options: AsyncSelectOption[]; hasMore: boolean; additional?: Additional };

interface PaginatedResponse<TItem> {
    data?: TItem[];
    pagination?: { totalPages: number };
}

const PAGE_SIZE = 10;

// Builds a `loadOptions` for endpoints that support page/limit/search and
// return { data, pagination } — the majority of list endpoints in this app.
// `dispatch` + `initiate` let this run outside a hook, since loadOptions is
// a plain async callback, not a component: pass `dispatch` from
// useAppDispatch() and `initiate` from `someApiService.endpoints.x.initiate`.
export function createPaginatedLoadOptions<TItem, TParams extends Record<string, any>>({
    dispatch,
    initiate,
    extraParams,
    mapItem,
    supportsSearch = true,
    pageSize = PAGE_SIZE,
}: {
    dispatch: (action: any) => { unwrap: () => Promise<PaginatedResponse<TItem>> };
    initiate: (params: TParams) => any;
    extraParams: Omit<TParams, "page" | "limit" | "search">;
    mapItem: (item: TItem) => AsyncSelectOption;
    supportsSearch?: boolean;
    pageSize?: number;
}) {
    return async (search: string, _loadedOptions: any, additional?: Additional): Promise<LoadResult> => {
        const page = additional?.page ?? 1;
        const params = {
            ...extraParams,
            page,
            limit: pageSize,
            ...(supportsSearch && search ? { search } : {}),
        } as unknown as TParams;

        const result = await dispatch(initiate(params)).unwrap();
        const items = result?.data || [];
        const totalPages = result?.pagination?.totalPages ?? 1;

        // When the endpoint has no search support, filter this page's
        // results client-side instead — results are only as complete as
        // what's been scrolled into view, since the API can't search ahead
        const visible = !supportsSearch && search
            ? items.filter((item) => mapItem(item).label.toLowerCase().includes(search.toLowerCase()))
            : items;

        return {
            options: visible.map(mapItem),
            hasMore: page < totalPages,
            additional: { page: page + 1 },
        };
    };
}

// Builds a `loadOptions` for endpoints that return the entire collection in
// one shot with no pagination/search support at all (e.g. all-departments,
// available-courses, available-departments) — fetched once, filtered
// client-side thereafter.
export function createFlatLoadOptions<TItem>({
    dispatch,
    initiate,
    arg,
    mapItem,
}: {
    dispatch: (action: any) => { unwrap: () => Promise<{ data?: TItem[] }> };
    initiate: (arg: any) => any;
    arg?: any;
    mapItem: (item: TItem) => AsyncSelectOption;
}) {
    return async (search: string): Promise<LoadResult> => {
        const result = await dispatch(initiate(arg)).unwrap();
        const items = result?.data || [];
        const visible = search
            ? items.filter((item) => mapItem(item).label.toLowerCase().includes(search.toLowerCase()))
            : items;
        return { options: visible.map(mapItem), hasMore: false };
    };
}
