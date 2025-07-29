import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';
import FacultyDashboard from '../Dashboard/FacultyDashboard';
import ExamDashboard from '../Dashboard/ExamDashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/student" element={<StudentDashboard />} />
                        <Route path="/faculty" element={<FacultyDashboard />} />
                        <Route path="/exam" element={<ExamDashboard />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;