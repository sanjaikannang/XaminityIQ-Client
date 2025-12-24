import { useState, useCallback } from "react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetCoursesWithDepartmentsQuery } from "../../../../state/services/endpoints/academics";

interface Department {
    _id: string;
    deptCode: string;
    deptName: string;
}

interface CourseWithDepartments {
    _id: string;
    streamCode: string;
    streamName: string;
    courseCode: string;
    courseName: string;
    level: string;
    duration: string;
    semesters: number;
    departments: Department[];
}

const SuperAdminDashboardPage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseWithDepartments | null>(null);

    const { data, isLoading, isFetching } = useGetCoursesWithDepartmentsQuery({
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

    const handleViewDepartments = useCallback((course: CourseWithDepartments) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    }, []);

    const columns: ColumnDef<CourseWithDepartments, any>[] = [
        {
            accessorKey: "streamCode",
            header: "Stream Code",
        },
        {
            accessorKey: "streamName",
            header: "Stream",
        },
        {
            accessorKey: "courseCode",
            header: "Course Code",
        },
        {
            accessorKey: "courseName",
            header: "Course",
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
            header: "Departments",
            cell: ({ row }: { row: { original: CourseWithDepartments } }) => (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewDepartments(row.original);
                    }}
                >
                    View ({row.original.departments.length})
                </Button>
            ),
        },
    ];

    return (
        <>          
            <Container>
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
                title={`Departments - ${selectedCourse?.courseName || ''}`}
                size="md"
            >
                {selectedCourse && (
                    <div className="space-y-4">
                        <div>                        
                            <div className="flex flex-wrap gap-3">
                                {selectedCourse.departments.map((dept) => (
                                    <div
                                        key={dept._id}
                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors w-fit"
                                    >
                                        <div className="font-medium whitespace-nowrap">
                                            {dept.deptName}
                                        </div>                                        
                                    </div>
                                ))}

                                {selectedCourse.departments.length === 0 && (
                                    <div className="w-full text-center py-8 text-gray-500">
                                        No departments available for this course
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default SuperAdminDashboardPage;