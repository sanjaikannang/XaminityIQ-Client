import { useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { DepartmentData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import Modal from "../../../../common/ui/Modal";

const DepartmentsPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isFetching } = useGetDepartmentsQuery({
        batchCourseId: courseId!,
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
    });

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

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const columns: ColumnDef<DepartmentData, any>[] = [
        {
            accessorKey: "deptCode",
            header: "Department Code",
        },
        {
            accessorKey: "deptName",
            header: "Department Name",
        },
        {
            accessorKey: "totalSeats",
            header: "Total Seats",
        },
        {
            accessorKey: "sectionCapacity",
            header: "Section Capacity",
        },
        {
            accessorKey: "sections",
            header: "Sections",
            cell: ({ getValue }: { getValue: () => any[] }) => {
                const sections = getValue();
                return sections?.length || 0;
            },
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
            <PageHeader>Departments</PageHeader>
            <Container>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        onClick={handleOpenModal}
                    >
                        Add Dept
                    </Button>
                </div>

                <div className="py-6">
                    <Table
                        columns={columns}
                        data={data?.data || []}
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

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Add New Dept"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-textSecondary">
                        Add your Dept form here
                    </p>
                    {/* Add your form components here */}
                </div>
            </Modal>
        </>
    );
};

export default DepartmentsPage;