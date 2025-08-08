import { Eye, Plus, Trash2, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../State/store';
import { useEffect, useState } from 'react';
import { removeStudent, setAllStudents, setStudentError, setStudentLoading } from '../../../State/Slices/adminSlice';
import { deleteStudent, getAllStudent } from '../../../Services/Admin/adminAPI';
import Table, { TableColumn, TableRow } from '../../../Common/UI/Table';
import { StudentResponse } from '../../../Types/admin.types';
import Modal from '../../../Common/UI/Modal';

const StudentDashboard = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  // Get state from Redux
  const {
    students,
    studentPagination,
    isStudentLoading,
    studentError
  } = useSelector((state: RootState) => state.admin);

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    studentId: '',
    studentName: '',
    isDeleting: false
  });

  // Fetch students data
  const fetchStudents = async (page: number = 1) => {
    try {
      dispatch(setStudentLoading(true));
      const response = await getAllStudent({
        page,
        limit: itemsPerPage
      });

      if (response.success) {
        dispatch(setAllStudents({
          students: response.data.students,
          pagination: response.data.pagination
        }));
      } else {
        dispatch(setStudentError('Failed to fetch students'));
      }
    } catch (error: any) {
      dispatch(setStudentError(error?.message || 'Failed to fetch students'));
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (studentId: string, studentName: string) => {
    setDeleteModal({
      isOpen: true,
      studentId,
      studentName,
      isDeleting: false
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      studentId: '',
      studentName: '',
      isDeleting: false
    });
  };

  // Handle delete student
  const handleDeleteStudent = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));

      const response = await deleteStudent(deleteModal.studentId);

      if (response.success) {
        dispatch(removeStudent(deleteModal.studentId));
        // Refetch current page to update pagination
        fetchStudents(currentPage);
        closeDeleteModal();

        // Optional: Show success message
        // You can use a toast notification here if you have one
      } else {
        dispatch(setStudentError('Failed to delete student'));
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
      }
    } catch (error: any) {
      dispatch(setStudentError(error?.message || 'Failed to delete student'));
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchStudents(page);
  };

  const handleCreateStudent = () => {
    navigate("create-student");
  }

  const handleCreateBulkStudent = () => {
    navigate("create-bulk-student");
  }

  const handleViewStudent = (studentId: string) => {
    navigate(`/admin/student/${studentId}`);
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents(currentPage);
  }, []);

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'studentId',
      label: 'Student ID',
      width: '120px',
    },
    {
      key: 'rollNumber',
      label: 'Roll Number',
      width: '170px',
    },
    {
      key: 'fullName',
      label: 'Full Name',
      width: '200px',
    },
    {
      key: 'email',
      label: 'Email',
      width: '250px',
    },
    {
      key: 'course',
      label: 'Course',
      width: '200px',
    },
    {
      key: 'branch',
      label: 'Branch',
      width: '150px',
    },
    {
      key: 'semester',
      label: 'Semester',
      width: '100px',
      align: 'center',
    },
    {
      key: 'batch',
      label: 'Batch',
      width: '120px',
      align: 'center',
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      align: 'center',
    },
  ];

  // Transform students data for table
  const tableData: TableRow[] = students.map((student: StudentResponse) => ({
    id: student._id,
    studentId: student.studentId,
    rollNumber: student.rollNumber,
    fullName: `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
    email: student.userId.email,
    course: student.academicInfo.course,
    branch: student.academicInfo.branch,
    semester: student.academicInfo.semester,
    batch: student.academicInfo.batch,
    status: student.status,
    actions: student._id,
    _fullName: `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
  }));

  // Custom cell renderer for specific columns
  const renderCell = (column: TableColumn, _row: TableRow, value: any) => {
    switch (column.key) {
      case 'status':
        return (
          <span
            className={`inline-flex px-4 py-1 text-xs font-semibold rounded-full ${value === 'active'
              ? 'bg-scecondary text-gray-300'
              : value === 'inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
              }`}
          >
            {value}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleViewStudent(value)}
              className="p-1 text-primary hover:bg-blue-50 rounded cursor-pointer"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => openDeleteModal(value, _row._fullName)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );

      default:
        return value;
    }
  };

  // Custom empty state
  const emptyState = {
    icon: <Users className="mx-auto h-12 w-12 text-gray-400" />,
    title: 'No students found',
    description: 'Get started by creating your first student.',
  };

  // Transform pagination data for Table component
  const paginationData = studentPagination ? {
    currentPage: studentPagination.currentPage,
    totalPages: studentPagination.totalPages,
    totalProducts: studentPagination.totalCount,
    hasNextPage: studentPagination.hasNextPage,
    hasPrevPage: studentPagination.hasPreviousPage,
  } : undefined;

  return (
    <>
      <main className="px-4 py-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between mb-2 mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Students</h1>
          </div>
          <div>
            <button
              onClick={handleCreateStudent}
              className="bg-primary text-whiteColor px-4 py-1 rounded-md cursor-pointer flex items-center gap-2"
            >
              <Plus size={18} />
              Create
            </button>

            <button
              onClick={handleCreateBulkStudent}
              className="bg-primary text-whiteColor px-4 py-1 rounded-md cursor-pointer flex items-center gap-2"
            >
              <Plus size={18} />
              Bulk Upload
            </button>


          </div>
        </div>

        {/* Error Message */}
        {studentError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{studentError}</p>
          </div>
        )}

        {/* Students Table */}
        <div className="mt-10">
          <Table
            columns={columns}
            data={tableData}
            loading={isStudentLoading}
            renderCell={renderCell}
            emptyState={emptyState}
            pagination={paginationData}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            showPagination={true}
            paginationLabel="students"
            className="shadow-sm"
          />
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          title="Delete Student"
          size="sm"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              You are about to delete <span className="font-semibold">{deleteModal.studentName}</span>.
              This action cannot be undone and will permanently remove all associated data.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleDeleteStudent}
                disabled={deleteModal.isDeleting}
                className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {deleteModal.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>

      </main>
    </>
  );
};

export default StudentDashboard;