import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { FacultyData } from "../../../../types/faculty-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetAllFacultyQuery } from "../../../../state/services/endpoints/faculty";

const FacultiesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isFetching } = useGetAllFacultyQuery({
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

    const handleRowClick = useCallback((row: FacultyData) => {
        navigate(`/super-admin/faculties/${row.id}`);
    }, [navigate]);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const columns: ColumnDef<FacultyData, any>[] = [
        {
            accessorKey: "facultyId",
            header: "Employee ID",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.employeeId}`;
            },
        },
        {
            accessorKey: "personalDetails.firstName",
            header: "Name",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.personalDetails.firstName} ${row.original.personalDetails.lastName}`;
            },
        },
        {
            accessorKey: "contactDetails.facultyEmail",
            header: "Personal Email",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.personalEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.facultyEmail",
            header: "Faculty Email",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.facultyEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.phoneNumber",
            header: "Phone",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.phoneNumber}`;
            },
        },
        {
            accessorKey: "employmentDetails.designation",
            header: "Designation",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.designation}`;
            },
        },
        {
            accessorKey: "employmentDetails.departmentName",
            header: "Department",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.departmentName}`;
            },
        },
        {
            accessorKey: "employmentDetails.employmentType",
            header: "Employment Type",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.employmentType}`;
            },
        },
        {
            accessorKey: "employmentDetails.dateOfJoining",
            header: "Date of Joining",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.dateOfJoining}`;
            },
        },
        {
            accessorKey: "employmentDetails.status",
            header: "Status",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.status}`;
            },
        },
    ];

    return (
        <>
            <PageHeader>Faculty</PageHeader>
            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    onClick={handleOpenModal}
                >
                    Add Faculty
                </Button>
            </div>

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
                        tableTitle="Faculty Members"
                        onSearch={handleSearch}
                    />
                </div>
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Add New Faculty"
                size="md"
            >
                <div></div>
            </Modal>
        </>
    );
};

export default FacultiesPage;