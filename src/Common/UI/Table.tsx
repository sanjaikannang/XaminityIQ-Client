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
                <div className="flex items-center justify-end gap-4 px-4 py-4 bg-whiteColor border border-gray-300 border-b-0 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        {onSearch && (
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search"
                                    className="pl-9 w-60 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Section - Show Skeleton when Loading */}
                {isLoading ? (
                    <div className="overflow-hidden border border-gray-300 border-t">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    {columns.map((_, i) => (
                                        <th
                                            key={i}
                                            className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                                        >
                                            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: pageLimit }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="bg-whiteColor border-b border-gray-200">
                                        {columns.map((_, colIndex) => (
                                            <td key={colIndex} className="px-4 py-3">
                                                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-hidden border border-gray-300 border-t">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-4 text-left text-sm font-medium text-gray-700"
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
                                            className={`border-t border-gray-200 ${onRowClick ? "cursor-pointer hover:bg-gray-50" : "bg-whiteColor"
                                                }`}
                                        >
                                            {columns.map((column, colIndex) => {
                                                const value = column.accessorKey
                                                    ? (row as any)[column.accessorKey]
                                                    : null;
                                                return (
                                                    <td key={colIndex} className="px-4 py-4 text-sm text-gray-700">
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
                                            className="h-24 text-center text-sm text-gray-500"
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
                    <div className="flex justify-end px-4 py-4 bg-whiteColor border-b border-r border-l border-gray-300 rounded-b-xl">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-10 rounded bg-gray-200 animate-pulse flex items-center justify-center">
                                <ChevronLeft className="text-gray-300" size={16} />
                            </div>

                            <div className="flex items-center gap-0.5">
                                <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                                <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                                <span className="text-gray-300 px-1">...</span>
                                <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                            </div>

                            <div className="h-8 w-10 rounded bg-gray-200 animate-pulse flex items-center justify-center">
                                <ChevronRight className="text-gray-300" size={16} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end px-4 py-4 bg-whiteColor border-b border-r border-l border-gray-300 rounded-b-xl">
                        <div className="flex items-center gap-2">
                            <button
                                className="h-8 px-4 text-sm font-medium rounded-xl cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className={`h-7 w-7 text-sm font-medium rounded-xl transition-colors cursor-pointer ${pageNumber === pageNum
                                                ? "text-gray-600 bg-gray-100"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="text-gray-400 px-1">...</span>
                                        <button
                                            onClick={() => onPageChange(totalPages)}
                                            className={`h-7 w-7 text-sm font-medium rounded-xl transition-colors cursor-pointer ${pageNumber === totalPages
                                                ? "text-gray-600 bg-gray-100"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className="h-8 px-4 text-sm font-medium rounded-xl cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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