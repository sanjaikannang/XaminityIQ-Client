import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AllExam from "../Component/AllExam";

const ExamDashboard = () => {

  const navigate = useNavigate()

  const handleCreateExam = () => {
    navigate("create-exam");
  }

  return (
    <>
      <main className="px-4 py-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between mb-2 mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Exam</h1>
          </div>
          <div>
            <button
              onClick={handleCreateExam}
              className="bg-primary text-whiteColor px-4 py-1 rounded-md cursor-pointer flex items-center gap-2"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        </div>

        {/* All Exam */}
        <div>
          <AllExam />
        </div>
      </main>
    </>
  )
}

export default ExamDashboard