import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {

  const navigate = useNavigate()

 const handleCreateStudent = () => {
    navigate("create-student");
  }

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
          </div>
        </div>

        {/* User Table */}
        <div>

        </div>
      </main>
    </>
  );
};

export default StudentDashboard;