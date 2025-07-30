import { Users } from "lucide-react";
import Table, { TableColumn, TableRow } from "../../../Common/UI/Table";

const StudentDashboard = () => {

  const data: TableRow[] = [
    {
      id: 'U001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'Student'
    },
    {
      id: 'U002',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'Student'
    },
    {
      id: 'U003',
      name: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      role: 'Student'
    }
  ];

  // Table configuration
  const columns: TableColumn[] = [
    { key: 'name', label: 'Full Name', width: '200px', align: 'left' },
    { key: 'id', label: 'User ID', width: '250px', align: 'left' },
    { key: 'email', label: 'Email Address', width: '250px', align: 'left' },
    { key: 'role', label: 'Role', width: '120px', align: 'left' },
  ];

  // Custom cell renderer
  const renderCell = (column: TableColumn, row: TableRow, value: any) => {
    switch (column.key) {
      case 'id':
        return (
          <div className="text-gray-600 flex items-center cursor-pointer hover:underline">
            <span className="break-all">{value}</span>
          </div>
        );
      case 'name':
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {value[0]}
                </span>
              </div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-900">{value}</div>
          </div>
        );
      case 'email':
        return <div className="text-gray-600 text-sm">{value}</div>;
      case 'role':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {value}
          </span>
        );
      default:
        return value;
    }
  };


  // Custom empty state
  const emptyState = {
    icon: <Users className="mx-auto h-12 w-12 text-gray-400" />,
    title: 'No users found',
    description: 'No users have been registered yet.'
  };

  return (
    <>
      <main className="px-4 py-4 bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
        </div>

        {/* Users Table */}
        <Table
          columns={columns}
          data={data}
          loading={false}
          renderCell={renderCell}
          emptyState={emptyState}
          showPagination={false} // Turn on if you want pagination
          paginationLabel="users"
        />
      </main>
    </>
  );
};

export default StudentDashboard;