import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useCallback } from "react";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { DepartmentData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import {
    useGetDepartmentsQuery,
    useGetAvailableDepartmentsQuery,
    useAddDepartmentToBatchCourseMutation
} from "../../../../state/services/endpoints/academics";
import Modal from "../../../../common/ui/Modal";
import CreateDepartmentForm, { CreateDepartmentFormValues } from "../components/CreateDepartmentForm";

const DepartmentsPage = () => {
    const navigate = useNavigate();
    const { courseId: batchCourseId } = useParams<{ courseId: string }>();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId'); // Get the actual courseId from query params
    const batchId = searchParams.get('batchId'); // Get the batchId from query params, for back navigation

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const { data, isLoading, isFetching } = useGetDepartmentsQuery({
        batchCourseId: batchCourseId!,
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const { data: availableDepartmentsData, isLoading: isLoadingAvailableDepartments } = useGetAvailableDepartmentsQuery(
        courseId!,
        { skip: !isModalOpen || !courseId }
    );

    const [addDepartmentToBatchCourse, { isLoading: isAdding }] = useAddDepartmentToBatchCourseMutation();

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

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleAddDepartment = useCallback(async (values: CreateDepartmentFormValues) => {
        try {
            const response = await addDepartmentToBatchCourse({
                batchCourseId: batchCourseId!,
                deptId: values.deptId,
                totalSeats: Number(values.totalSeats),
                ...(values.sectionCapacity && { sectionCapacity: Number(values.sectionCapacity) }),
            }).unwrap();
            handleCloseModal();
            toast.success(response.message || 'Department added successfully!');
        } catch (error: any) {
            throw error;
        }
    }, [addDepartmentToBatchCourse, batchCourseId, handleCloseModal]);

    const columns: ColumnDef<DepartmentData, any>[] = [
        {
            accessorKey: "deptCode",
            header: "Department Code",
            sortKey: "deptCode",
        },
        {
            accessorKey: "deptName",
            header: "Department Name",
            sortKey: "deptName",
        },
        {
            accessorKey: "totalSeats",
            header: "Total Seats",
            sortKey: "totalSeats",
        },
        {
            accessorKey: "sectionCapacity",
            header: "Section Capacity",
            sortKey: "sectionCapacity",
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
            sortKey: "createdAt",
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
                <div className="mb-6">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(
                            batchId
                                ? `/super-admin/academics/batches/${batchId}/courses`
                                : "/super-admin/academics/batches"
                        )}
                    >
                        ← Back to Courses
                    </Button>
                </div>

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
                        tableTitle="Departments"
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
                title="Add Department to Course"
                size="md"
            >
                <CreateDepartmentForm
                    availableDepartments={availableDepartmentsData?.data || []}
                    onSubmit={handleAddDepartment}
                    onCancel={handleCloseModal}
                    isLoading={isAdding}
                    isLoadingDepartments={isLoadingAvailableDepartments}
                />
            </Modal>
        </>
    );
};

export default DepartmentsPage;