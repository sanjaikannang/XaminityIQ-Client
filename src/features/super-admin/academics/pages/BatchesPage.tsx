import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { BatchData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetBatchesQuery } from "../../../../state/services/endpoints/academics";

const BatchesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isFetching } = useGetBatchesQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
    });

    const handleSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setPage(1); // Reset to first page on search
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when page size changes
    }, []);

    const handleRowClick = useCallback((row: BatchData) => {
        navigate(`/super-admin/academics/batches/${row._id}/courses`);
    }, [navigate]);

    const columns: ColumnDef<BatchData, any>[] = [
        {
            accessorKey: "batchName",
            header: "Batch Name",
        },
        {
            accessorKey: "startYear",
            header: "Start Year",
        },
        {
            accessorKey: "endYear",
            header: "End Year",
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ getValue }: { getValue: () => string }) => {
                const date = new Date(getValue());
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            },
        },
    ];

    return (
        <>
            <PageHeader>Batches</PageHeader>
            <Container>
                <div className="py-6">
                    <Table
                        columns={columns}
                        data={data?.data || []}
                        onRowClick={handleRowClick}
                        totalCount={data?.pagination?.totalItems || 0}
                        pageNumber={page}
                        pageLimit={pageSize}
                        totalPages={data?.pagination?.totalPages || 1}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        isLoading={isLoading || isFetching}
                        onSearch={handleSearch}
                    />
                </div>
            </Container>
        </>
    );
};

export default BatchesPage;