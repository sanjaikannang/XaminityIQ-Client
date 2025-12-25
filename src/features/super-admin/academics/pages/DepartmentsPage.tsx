import toast from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
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
    const { courseId: batchCourseId } = useParams<{ courseId: string }>();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId'); // Get the actual courseId from query params

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isFetching } = useGetDepartmentsQuery({
        batchCourseId: batchCourseId!,
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
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
                        tableTitle="Departments"
                        onSearch={handleSearch}
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