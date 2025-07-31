import { Plus } from "lucide-react"

const FacultyDashboard = () => {

  const handleCreateFaculty = () => {
    console.log("create faculty button clicked")
  }

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

        {/* Faculty Table */}
        <div>

        </div>
      </main>
    </>
  )
}

export default FacultyDashboard