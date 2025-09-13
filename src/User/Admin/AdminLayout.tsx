import React, { useState } from "react"
import MainComponent from "./Component/MainComponent";
import Sidebar from "./Component/Sidebar/Sidebar";
import Header from "./Component/Header/Header";

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