import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../Dashboard/AdminDashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route index element={<AdminDashboard />} />

                        {/* Students Screens */}
                        {/* <Route path="student" element={<StudentDashboard />} />
                        <Route path="student/create-student" element={<CreateStudent />} />
                        <Route path="student/:id" element={<StudentDetail />} /> */}

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;