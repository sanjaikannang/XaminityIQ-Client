import { Route, Routes } from 'react-router-dom';
import StudentDashboard from '../Dashboard/StudentDashboard';
import FacultyDashboard from '../Dashboard/FacultyDashboard';
import AdminDashboard from '../Dashboard/AdminDashboard';
import CreateStudent from './StudentDashboard/components/CreateStudent/CreateStudent';
import StudentDetail from './StudentDashboard/components/StudentDetail/StudentDetail';
import CreateFaculty from './FacultyDashboard/components/CreateFaculty/CreateFaculty';
import FacultyDetail from './FacultyDashboard/components/FacultyDetail/FacultyDetail';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route index element={<AdminDashboard />} />

                        {/* Students Screens */}
                        <Route path="student" element={<StudentDashboard />} />
                        <Route path="student/create-student" element={<CreateStudent />} />
                        <Route path="student/:id" element={<StudentDetail />} />

                        {/* Faculty Screens */}
                        <Route path="faculty" element={<FacultyDashboard />} />
                        <Route path="faculty/create-faculty" element={<CreateFaculty />} />
                        <Route path="faculty/:id" element={<FacultyDetail />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;