import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export interface ColumnDef<TData, TValue> {
    accessorKey?: string;
    header: string | (() => React.ReactNode);
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
}: TableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch?.(value);
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
                    </div>
                </div>

                {/* Table Section - Show Skeleton when Loading */}
                {isLoading ? (
                    <div className="overflow-hidden border border-borderLight border-t">
                        <table className="w-full border-collapse">
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
                    <div className="overflow-hidden border border-borderLight border-t">
                        <table className="w-full border-collapse">
                            <thead className="bg-bgSecondary">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-4 text-left text-md font-semibold text-textSecondary"
                                        >
                                            {typeof column.header === "function"
                                                ? column.header()
                                                : column.header}
                                        </th>
                                    ))}
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
                                                    <td key={colIndex} className="px-4 py-4 text-sm text-textPrimary">
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