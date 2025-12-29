import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { StudentsData } from "../../../../types/students-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetAllStudentsQuery } from "../../../../state/services/endpoints/students";

const StudentsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isFetching } = useGetAllStudentsQuery({
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

    const handleRowClick = useCallback((row: StudentsData) => {
        navigate(`/super-admin/students/${row.id}`);
    }, [navigate]);

    const columns: ColumnDef<StudentsData, any>[] = [
        {
            accessorKey: "academicDetails.rollNumber",
            header: "Roll Number",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.rollNumber}`;
            },
        },
        {
            accessorKey: "personalDetails.firstName",
            header: "Name",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.personalDetails.firstName} ${row.original.personalDetails.lastName}`;
            },
        },
        {
            accessorKey: "contactDetails.personalEmail",
            header: "Personal Email",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.personalEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.studentEmail",
            header: "Student Email",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.studentEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.phoneNumber",
            header: "Phone",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.phoneNumber}`;
            },
        },
        {
            accessorKey: "academicDetails.batchName",
            header: "Batch",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.batchName}`;
            },
        },
        {
            accessorKey: "academicDetails.courseName",
            header: "Course",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.courseName}`;
            },
        },
        {
            accessorKey: "academicDetails.departmentName",
            header: "Department",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.departmentName}`;
            },
        },
        {
            accessorKey: "academicDetails.sectionName",
            header: "Section",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.sectionName}`;
            },
        },
        {
            accessorKey: "academicDetails.currentSemester",
            header: "Semester",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.currentSemester}`;
            },
        },
        {
            accessorKey: "academicDetails.status",
            header: "Status",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.status}`;
            },
        },
    ];

    return (
        <>
            <PageHeader>Students</PageHeader>
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
                        tableTitle="Students"
                        onSearch={handleSearch}
                    />
                </div>
            </Container>
        </>
    );
};

export default StudentsPage;