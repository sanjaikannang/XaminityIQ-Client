import { useState, useCallback } from "react";
import {
    Users, GraduationCap, UserCog, ClipboardCheck, ClipboardList,
    AlertTriangle, Building2, BookOpen, Layers, LogIn, LogOut, Activity,
} from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import Chip from "../../../../common/ui/Chip";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDateTime } from "../../../../utils/date";
import { useGetCoursesWithDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import { useGetDashboardOverviewQuery } from "../../../../state/services/endpoints/dashboard";
import StatsCard from "../components/StatsCard";
import DashboardCharts from "../components/DashboardCharts";

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

    const { data: overviewResponse, isLoading: isOverviewLoading } = useGetDashboardOverviewQuery();
    const overview = overviewResponse?.data;

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
        { accessorKey: "streamCode", header: "Stream Code", width: "150px" },
        { accessorKey: "streamName", header: "Stream", width: "180px" },
        { accessorKey: "courseCode", header: "Course Code", width: "150px" },
        { accessorKey: "courseName", header: "Course", width: "200px" },
        { accessorKey: "level", header: "Level", width: "120px" },
        { accessorKey: "duration", header: "Duration", width: "120px" },
        { accessorKey: "semesters", header: "Semesters", width: "120px" },
        {
            header: "Departments",
            width: "160px",
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
            <PageHeader>Admin Dashboard</PageHeader>
            <Container>
                <div className="space-y-6 py-6">
                    {isOverviewLoading || !overview ? (
                        <div className="py-10 text-center text-textSecondary">Loading dashboard...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    title="Total Students"
                                    value={overview.counts.totalStudents}
                                    subtitle={`${overview.counts.activeStudents} active`}
                                    icon={Users}
                                    variant="primary"
                                />
                                <StatsCard
                                    title="Total Faculty"
                                    value={overview.counts.totalFaculty}
                                    subtitle={`${overview.counts.activeFaculty} active`}
                                    icon={UserCog}
                                    variant="indigo"
                                />
                                <StatsCard
                                    title="Total Exams"
                                    value={overview.counts.totalExams}
                                    icon={ClipboardCheck}
                                    variant="success"
                                />
                                <StatsCard
                                    title="Total Attempts"
                                    value={overview.counts.totalAttempts}
                                    subtitle={overview.counts.flaggedAttempts > 0 ? `${overview.counts.flaggedAttempts} flagged` : undefined}
                                    icon={overview.counts.flaggedAttempts > 0 ? AlertTriangle : ClipboardList}
                                    variant={overview.counts.flaggedAttempts > 0 ? "danger" : "warning"}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard title="Departments" value={overview.counts.totalDepartments} icon={Building2} variant="purple" />
                                <StatsCard title="Courses" value={overview.counts.totalCourses} icon={GraduationCap} variant="primary" />
                                <StatsCard title="Batches" value={overview.counts.totalBatches} icon={Layers} variant="indigo" />
                                <StatsCard title="Subjects" value={overview.counts.totalSubjects} icon={BookOpen} variant="success" />
                            </div>

                            <DashboardCharts data={overview} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <section className="lg:col-span-2 bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <h2 className="text-lg font-bold text-textPrimary mb-4">Recent Exams</h2>
                                    {overview.recentExams.length === 0 ? (
                                        <p className="text-sm text-textSecondary">No exams created yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto rounded-md border border-borderLight">
                                            <table className="w-full text-sm">
                                                <thead className="bg-bgSecondary">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Exam</th>
                                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Mode</th>
                                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Status</th>
                                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Created</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-borderLight">
                                                    {overview.recentExams.map((exam) => (
                                                        <tr key={exam.examId}>
                                                            <td className="px-3 py-2 text-textPrimary font-medium">{exam.name}</td>
                                                            <td className="px-3 py-2">
                                                                <Chip label={formatEnumLabel(exam.mode)} variant={getChipVariant(exam.mode)} />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Chip label={formatEnumLabel(exam.status)} variant={getChipVariant(exam.status)} />
                                                            </td>
                                                            <td className="px-3 py-2 text-textSecondary">{formatDateTime(exam.createdAt)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>

                                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="w-5 h-5 text-primary" />
                                        <h2 className="text-lg font-bold text-textPrimary">Recent Activity</h2>
                                    </div>
                                    {overview.recentActivity.length === 0 ? (
                                        <p className="text-sm text-textSecondary">No activity recorded yet.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-[340px] overflow-y-auto">
                                            {overview.recentActivity.map((activity, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.action === "LOGIN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                        {activity.action === "LOGIN" ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-textPrimary truncate">
                                                            <span className="font-medium">{activity.email}</span> {activity.action === "LOGIN" ? "logged in" : "logged out"}
                                                        </p>
                                                        <p className="text-xs text-textTertiary">{formatEnumLabel(activity.role)} · {formatDateTime(activity.createdAt)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        </>
                    )}

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
