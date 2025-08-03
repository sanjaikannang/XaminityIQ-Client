import { Eye, Plus, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../State/store";
import { removeFaculty, setAllFaculty, setFacultyError, setFacultyLoading } from "../../../State/Slices/adminSlice";
import { deleteFaculty, getAllFaculty } from "../../../Services/Admin/adminAPI";
import Table, { TableColumn, TableRow } from "../../../Common/UI/Table";
import { FacultyResponse } from "../../../Types/admin.types";

const FacultyDashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const {
    faculty,
    facultyPagination,
    isFacultyLoading,
    facultyError
  } = useSelector((state: RootState) => state.admin);

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch faculty data
  const fetchFaculty = async (page: number = 1) => {
    try {
      dispatch(setFacultyLoading(true));
      const response = await getAllFaculty({
        page,
        limit: itemsPerPage
      });

      if (response.success) {
        dispatch(setAllFaculty({
          faculty: response.data.faculty,
          pagination: response.data.pagination
        }));
      } else {
        dispatch(setFacultyError('Failed to fetch faculty'));
      }
    } catch (error: any) {
      dispatch(setFacultyError(error?.message || 'Failed to fetch faculty'));
    }
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (facultyId: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        dispatch(setFacultyLoading(true));
        const response = await deleteFaculty(facultyId);

        if (response.success) {
          dispatch(removeFaculty(facultyId));
          // Refetch current page to update pagination
          fetchFaculty(currentPage);
        } else {
          dispatch(setFacultyError('Failed to delete faculty'));
        }
      } catch (error: any) {
        dispatch(setFacultyError(error?.message || 'Failed to delete faculty'));
      }
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchFaculty(page);
  };

  const handleCreateFaculty = () => {
    navigate("create-faculty");
  }

  const handleViewFaculty = (facultyId: string) => {
    navigate(`faculty/${facultyId}`);
  };

  // Load faculty on component mount
  useEffect(() => {
    fetchFaculty(currentPage);
  }, []);

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'facultyId',
      label: 'Faculty ID',
      width: '120px',
    },
    {
      key: 'employeeId',
      label: 'Employee ID',
      width: '120px',
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
      key: 'department',
      label: 'Department',
      width: '180px',
    },
    {
      key: 'designation',
      label: 'Designation',
      width: '180px',
    },
    {
      key: 'phone',
      label: 'Phone',
      width: '140px',
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
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

  // Transform faculty data for table
  const tableData: TableRow[] = faculty.map((facultyMember: FacultyResponse) => ({
    id: facultyMember._id,
    facultyId: facultyMember.facultyId,
    employeeId: facultyMember.professionalInfo.employeeId || '-',
    fullName: `${facultyMember.personalInfo.firstName} ${facultyMember.personalInfo.lastName}`,
    email: facultyMember.userId.email,
    department: facultyMember.professionalInfo.department,
    designation: facultyMember.professionalInfo.designation,
    phone: facultyMember.contactInfo.phone || '-',
    joiningDate: new Date(facultyMember.joiningDate).toLocaleDateString(),
    status: facultyMember.status,
    actions: facultyMember._id,
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

      case 'joiningDate':
        return (
          <span className="text-sm text-gray-900">
            {value}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleViewFaculty(value)}
              className="p-1 text-primary hover:bg-blue-50 rounded cursor-pointer"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleDeleteFaculty(value)}
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
    title: 'No faculty found',
    description: 'Get started by creating your first faculty member.',
  };

  // Transform pagination data for Table component
  const paginationData = facultyPagination ? {
    currentPage: facultyPagination.currentPage,
    totalPages: facultyPagination.totalPages,
    totalProducts: facultyPagination.totalCount,
    hasNextPage: facultyPagination.hasNextPage,
    hasPrevPage: facultyPagination.hasPreviousPage,
  } : undefined;

  return (
    <>
      <main className="px-4 py-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between mb-2 mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Faculty</h1>
          </div>
          <div>
            <button
              onClick={handleCreateFaculty}
              className="bg-primary text-whiteColor px-4 py-1 rounded-md cursor-pointer flex items-center gap-2"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        </div>

        {/* Error Message */}
        {facultyError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{facultyError}</p>
          </div>
        )}

        {/* Faculty Table */}
        <div className="mt-10">
          <Table
            columns={columns}
            data={tableData}
            loading={isFacultyLoading}
            renderCell={renderCell}
            emptyState={emptyState}
            pagination={paginationData}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            showPagination={true}
            paginationLabel="faculty members"
            className="shadow-sm"
          />
        </div>

      </main>
    </>
  )
}

export default FacultyDashboard