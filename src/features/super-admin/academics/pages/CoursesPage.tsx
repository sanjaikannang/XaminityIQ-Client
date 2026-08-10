import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import Button from "../../../../common/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { CourseData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { formatDate } from "../../../../utils/date";
import {
    useGetCoursesQuery,
    useGetAvailableCoursesQuery,
    useMapCourseToBatchMutation
} from "../../../../state/services/endpoints/academics";
import Modal from "../../../../common/ui/Modal";
import CreateCourseForm, { CreateCourseFormValues } from "../components/CreateCourseForm";

const CoursesPage = () => {
    const navigate = useNavigate();
    const { batchId } = useParams<{ batchId: string }>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const { data, isLoading, isFetching } = useGetCoursesQuery({
        batchId: batchId!,
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const { data: availableCoursesData, isLoading: isLoadingAvailableCourses } = useGetAvailableCoursesQuery(
        batchId!,
        { skip: !isModalOpen }
    );

    const [mapCourseToBatch, { isLoading: isMapping }] = useMapCourseToBatchMutation();

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

    const handleSortChange = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(1);
    }, []);

    const handleRowClick = useCallback((row: CourseData) => {
        navigate(`/super-admin/academics/courses/${row.batchCourseId}/departments?courseId=${row._id}&batchId=${batchId}`);
    }, [navigate, batchId]);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleMapCourse = useCallback(async (values: CreateCourseFormValues) => {
        try {
            const response = await mapCourseToBatch({
                batchId: batchId!,
                courseId: values.courseId,
            }).unwrap();
            handleCloseModal();
            toast.success(response.message || 'Course added successfully!');
        } catch (error: any) {
            throw error;
        }
    }, [mapCourseToBatch, batchId, handleCloseModal]);

    const columns: ColumnDef<CourseData, any>[] = [
        {
            accessorKey: "courseCode",
            header: "Course Code",
            sortKey: "courseCode",
            width: "150px",
        },
        {
            accessorKey: "courseName",
            header: "Course Name",
            sortKey: "courseName",
            width: "250px",
        },
        {
            accessorKey: "streamCode",
            header: "Stream Code",
            sortKey: "streamCode",
            width: "150px",
        },
        {
            accessorKey: "streamName",
            header: "Stream Name",
            sortKey: "streamName",
            width: "300px",
        },
        {
            accessorKey: "level",
            header: "Level",
            sortKey: "level",
            width: "120px",
        },
        {
            accessorKey: "duration",
            header: "Duration",
            sortKey: "duration",
            width: "120px",
        },
        {
            accessorKey: "semesters",
            header: "Semesters",
            sortKey: "semesters",
            width: "120px",
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            sortKey: "createdAt",
            width: "150px",
            cell: ({ getValue }: { getValue: () => string }) => formatDate(getValue()),
        },
    ];

    return (
        <>
            <PageHeader>Courses</PageHeader>
            <Container>
                <div className="mb-6">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/super-admin/academics/batches")}
                    >
                        ← Back to Batches
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        onClick={handleOpenModal}
                    >
                        Add Course
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
                        tableTitle="Courses"
                        onSearch={handleSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />
                </div>
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Add Course to Batch"
                size="md"
            >
                <CreateCourseForm
                    availableCourses={availableCoursesData?.data || []}
                    onSubmit={handleMapCourse}
                    onCancel={handleCloseModal}
                    isLoading={isMapping}
                    isLoadingCourses={isLoadingAvailableCourses}
                />
            </Modal>
        </>
    );
};

export default CoursesPage;