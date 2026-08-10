import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, Search, ListFilter } from "lucide-react";
import { useState } from "react";

export interface ColumnDef<TData, TValue> {
    accessorKey?: string;
    header: string | (() => React.ReactNode);
    sortKey?: string;
    width?: string;
    cell?: (info: {
        row: { original: TData };
        getValue: () => TValue;
    }) => React.ReactNode;
}

interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (row: TData) => void;
    totalCount: number;
    pageNumber: number;
    pageLimit: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isLoading: boolean;
    tableTitle: string;
    onSearch?: (searchTerm: string) => void;
    onFilterApply?: (filters: Record<string, any>) => void;
    filters?: React.ReactNode;
    hasActiveFilters?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function Table<TData, TValue>({
    columns,
    data,
    onRowClick,
    pageNumber,
    pageLimit,
    totalPages,
    onPageChange,
    isLoading,
    tableTitle,
    onSearch,
    filters,
    hasActiveFilters,
    sortBy,
    sortOrder,
    onSortChange,
}: TableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch?.(value);
    };

    const handleSortClick = (key: string) => {
        if (!onSortChange) return;
        if (sortBy === key) {
            onSortChange(key, sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            onSortChange(key, 'asc');
        }
    };

    const canGoPrevious = pageNumber > 1;
    const canGoNext = pageNumber < totalPages;

    return (
        <>
            <div className="w-full">
                {/* Search and Filter Bar */}
                <div className="flex items-center justify-between gap-4 px-4 py-4 bg-whiteColor border border-borderLight border-b-0 rounded-t-xl">
                    <div>
                        <div className="font-medium text-2xl">{tableTitle}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        {onSearch && (
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textTertiary"
                                    size={16}
                                />
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search"
                                    className="pl-9 w-60 px-3 py-2 border border-borderLight rounded-lg focus:outline-none text-textPrimary placeholder:text-textPlaceholder"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        )}

                        {/* Filter Toggle Button */}
                        {filters && (
                            <button
                                type="button"
                                onClick={() => setShowFilters((prev) => !prev)}
                                title="Filters"
                                className={`relative flex items-center justify-center h-10 w-10 border rounded-lg cursor-pointer transition-colors ${showFilters
                                    ? "bg-primary text-whiteColor border-primary"
                                    : "border-borderLight text-textSecondary hover:bg-bgSecondary"
                                    }`}
                            >
                                <ListFilter size={18} />
                                {hasActiveFilters && (
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-whiteColor" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters Section - Collapsed by default, opens below title/search bar */}
                {filters && showFilters && (
                    <div className="flex flex-wrap items-end gap-3 px-4 py-4 bg-whiteColor border-l border-r border-borderLight">
                        {filters}
                    </div>
                )}

                {/* Table Section - Show Skeleton when Loading */}
                {isLoading ? (
                    <div className="overflow-x-auto border border-borderLight border-t">
                        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                            <colgroup>
                                {columns.map((column, i) => (
                                    <col key={i} style={{ width: column.width }} />
                                ))}
                            </colgroup>
                            <thead className="bg-bgSecondary">
                                <tr>
                                    {columns.map((_, i) => (
                                        <th
                                            key={i}
                                            className="px-4 py-3 text-left text-sm font-medium text-textSecondary"
                                        >
                                            <div className="h-4 w-24 rounded bg-borderLight animate-pulse" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: pageLimit }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="bg-whiteColor border-b border-borderLight">
                                        {columns.map((_, colIndex) => (
                                            <td key={colIndex} className="px-4 py-3">
                                                <div className="h-4 w-full rounded bg-borderLight animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-borderLight border-t">
                        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                            <colgroup>
                                {columns.map((column, i) => (
                                    <col key={i} style={{ width: column.width }} />
                                ))}
                            </colgroup>
                            <thead className="bg-bgSecondary">
                                <tr>
                                    {columns.map((column, index) => {
                                        const label = typeof column.header === "function"
                                            ? column.header()
                                            : column.header;

                                        if (!column.sortKey) {
                                            return (
                                                <th
                                                    key={index}
                                                    className="px-4 py-4 text-left text-md font-semibold text-textSecondary break-words"
                                                >
                                                    {label}
                                                </th>
                                            );
                                        }

                                        const isActive = sortBy === column.sortKey;

                                        return (
                                            <th
                                                key={index}
                                                className="px-4 py-4 text-left text-md font-semibold text-textSecondary break-words"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleSortClick(column.sortKey as string)}
                                                    className="flex items-center gap-1 cursor-pointer hover:text-textPrimary"
                                                >
                                                    {label}
                                                    {isActive ? (
                                                        sortOrder === 'asc' ? (
                                                            <ChevronUp size={14} />
                                                        ) : (
                                                            <ChevronDown size={14} />
                                                        )
                                                    ) : (
                                                        <ChevronsUpDown size={14} className="text-textTertiary" />
                                                    )}
                                                </button>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            onClick={() => onRowClick?.(row)}
                                            className={`border-t border-borderLight ${onRowClick ? "cursor-pointer bg-whiteColor hover:bg-bgSecondary" : "bg-whiteColor"
                                                }`}
                                        >
                                            {columns.map((column, colIndex) => {
                                                const value = column.accessorKey
                                                    ? (row as any)[column.accessorKey]
                                                    : null;
                                                return (
                                                    <td key={colIndex} className="px-4 py-4 text-sm text-textPrimary break-words">
                                                        {column.cell
                                                            ? column.cell({
                                                                row: { original: row },
                                                                getValue: () => value as TValue,
                                                            })
                                                            : value}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="h-24 text-center text-sm text-textSecondary"
                                        >
                                            No results.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Section - Show Skeleton when Loading */}
                {isLoading ? (
                    <div className="flex justify-end px-4 py-4 bg-whiteColor border-b border-r border-l border-borderLight rounded-b-xl">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-10 rounded bg-borderLight animate-pulse flex items-center justify-center">
                                <ChevronLeft className="text-textDisabled" size={16} />
                            </div>

                            <div className="flex items-center gap-0.5">
                                <div className="h-7 w-7 rounded bg-borderLight animate-pulse" />
                                <div className="h-7 w-7 rounded bg-borderLight animate-pulse" />
                                <span className="text-textTertiary px-1">...</span>
                                <div className="h-7 w-7 rounded bg-borderLight animate-pulse" />
                            </div>

                            <div className="h-8 w-10 rounded bg-borderLight animate-pulse flex items-center justify-center">
                                <ChevronRight className="text-textDisabled" size={16} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end px-4 py-4 bg-whiteColor border-b border-r border-l border-borderLight rounded-b-xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <button
                                className="h-8 px-4 text-sm font-medium rounded-lg cursor-pointer border border-borderLight text-textPrimary hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => onPageChange(pageNumber - 1)}
                                disabled={!canGoPrevious}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: Math.min(2, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange(pageNum)}
                                            className={`h-7 w-7 text-sm font-medium rounded-lg transition-colors cursor-pointer ${pageNumber === pageNum
                                                ? "text-whiteColor bg-primary"
                                                : "text-textPrimary hover:bg-bgSecondary"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="text-textTertiary px-1">...</span>
                                        <button
                                            onClick={() => onPageChange(totalPages)}
                                            className={`h-7 w-7 text-sm font-medium rounded-lg transition-colors cursor-pointer ${pageNumber === totalPages
                                                ? "text-whiteColor bg-primary"
                                                : "text-textPrimary hover:bg-bgSecondary"
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className="h-8 px-4 text-sm font-medium rounded-lg cursor-pointer border border-borderLight text-textPrimary hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => onPageChange(pageNumber + 1)}
                                disabled={!canGoNext}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}