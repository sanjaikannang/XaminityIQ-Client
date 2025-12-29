import { useState, useCallback } from "react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetCoursesWithDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import StatsCard from "../components/StatsCard";
import { GraduationCap, TrendingUp, Users } from "lucide-react";
import Metrics from "../components/Metrics";

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

const mockData = {
    students: {
        total: 1250,
        active: 1100,
        alumni: 850,
        suspended: 15,
        newAdmissions: 45,
        trend: 8.5,
    },
    faculty: {
        total: 85,
        active: 82,
        trend: 2.4,
    },
    academic: {
        totalBatches: 24,
        totalCourses: 156,
        totalDepartments: 8,
        totalSections: 48,
    },
    exams: {
        completed: 342,
        ongoing: 12,
        upcoming: 28,
    },
    users: {
        total: 1385,
        active: 1205,
        firstTimeLogin: 35,
        passwordReset: 18,
    },
    monthlyAdmissions: [
        { month: "Jan", count: 32 },
        { month: "Feb", count: 28 },
        { month: "Mar", count: 45 },
        { month: "Apr", count: 52 },
        { month: "May", count: 38 },
        { month: "Jun", count: 65 },
        { month: "Jul", count: 78 },
        { month: "Aug", count: 92 },
        { month: "Sep", count: 45 },
    ],
    departmentDistribution: [
        { name: "Computer Science", value: 320 },
        { name: "Engineering", value: 280 },
        { name: "Business", value: 210 },
        { name: "Arts", value: 150 },
        { name: "Science", value: 180 },
        { name: "Medicine", value: 110 },
    ],
};

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
                <div>
                    {/* Header */}
                    <div className="mb-6 mt-6">
                        <h1 className="text-3xl font-medium">Admin Dashboard</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Students"
                            value={mockData.students.total}
                            icon={<Users className="w-6 h-6 text-whiteColor" />}
                            trend={mockData.students.trend}
                            color="bg-blue-500"
                        />
                        <StatsCard
                            title="Active Students"
                            value={mockData.students.active}
                            icon={<GraduationCap className="w-6 h-6 text-whiteColor" />}
                            color="bg-green-500"
                        />
                        <StatsCard
                            title="Total Faculty"
                            value={mockData.faculty.total}
                            icon={<Users className="w-6 h-6 text-whiteColor" />}
                            trend={mockData.faculty.trend}
                            color="bg-purple-500"
                        />
                        <StatsCard
                            title="New Admissions"
                            value={mockData.students.newAdmissions}
                            icon={<TrendingUp className="w-6 h-6 text-whiteColor" />}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Metrics */}
                    <div>
                        <Metrics />
                    </div>
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
                        tableTitle="Courses & Departments"
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