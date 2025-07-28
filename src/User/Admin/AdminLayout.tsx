import React, { useState } from "react"
import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import MainComponent from "./Component/MainComponent";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header */}
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Main Content */}
          <MainComponent />
        </div>
      </div>
    </>
  )
}

export default AdminLayout