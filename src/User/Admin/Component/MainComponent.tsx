import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';
import FacultyDashboard from '../Dashboard/FacultyDashboard';
import ExamDashboard from '../Dashboard/ExamDashboard';
import CreateStudent from './CreateStudent';
import CreateFaculty from './CreateFaculty';

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

                        {/* Faculty Screens */}
                        <Route path="faculty" element={<FacultyDashboard />} />
                        <Route path="faculty/create-faculty" element={<CreateFaculty />} />

                        {/* Exam Screens */}
                        <Route path="exam" element={<ExamDashboard />} />
                        <Route path="exam/create-exam" element={<FacultyDashboard />} />

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;