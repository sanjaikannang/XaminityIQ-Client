import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { BatchData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import CreateBatchForm, { CreateBatchFormValues } from "../components/CreateBatchForm";
import { useGetBatchesQuery, useCreateBatchMutation } from "../../../../state/services/endpoints/academics";

const BatchesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isFetching } = useGetBatchesQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
    });

    const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();

    const handleSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    }, []);

    const handleRowClick = useCallback((row: BatchData) => {
        navigate(`/super-admin/academics/batches/${row._id}/courses`);
    }, [navigate]);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleCreateBatch = useCallback(async (values: CreateBatchFormValues) => {
        try {
            const response = await createBatch(values).unwrap();
            handleCloseModal();
            toast.success(response.message || 'Batch created successfully!');
            handleCloseModal();
        } catch (error) {
            throw error;
        }
    }, [createBatch, handleCloseModal]);

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
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        onClick={handleOpenModal}
                    >
                        Create Batch
                    </Button>
                </div>

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
                        tableTitle="Batches"
                        onSearch={handleSearch}
                    />
                </div>
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Create New Batch"
                size="md"
            >
                <CreateBatchForm
                    onSubmit={handleCreateBatch}
                    onCancel={handleCloseModal}
                    isLoading={isCreating}
                />
            </Modal>
        </>
    );
};

export default BatchesPage;