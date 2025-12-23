import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { CourseData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetCoursesQuery } from "../../../../state/services/endpoints/academics";

const CoursesPage = () => {
    const navigate = useNavigate();
    const { batchId } = useParams<{ batchId: string }>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isFetching } = useGetCoursesQuery({
        batchId: batchId!,
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

    const handleRowClick = useCallback((row: CourseData) => {
        // Navigate to course details or wherever you need
        navigate(`/super-admin/academics/courses/${row._id}/departments`);
    }, [navigate, batchId]);

    const columns: ColumnDef<CourseData, any>[] = [
        {
            accessorKey: "courseCode",
            header: "Course Code",
        },
        {
            accessorKey: "courseName",
            header: "Course Name",
        },
        {
            accessorKey: "streamCode",
            header: "Stream Code",
        },
        {
            accessorKey: "streamName",
            header: "Stream Name",
        },
        {
            accessorKey: "level",
            header: "Level",
        },
        {
            accessorKey: "duration",
            header: "Duration",
        },
        {
            accessorKey: "semesters",
            header: "Semesters",
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
            <PageHeader>Courses</PageHeader>
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

export default CoursesPage;