import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';
import FacultyDashboard from '../Dashboard/FacultyDashboard';
import ExamDashboard from '../Dashboard/ExamDashboard';
import CreateStudent from './CreateStudent';
import CreateFaculty from './CreateFaculty';
import StudentDetail from './StudentDetail';
import FacultyDetail from './FacultyDetail';
import BulkUploadStudent from './BulkUploadStudent';
import AllExam from './AllExam';
import CreateExam from './Exam/CreateExam/CreateExam';
import MasterDataDashboard from '../Dashboard/MasterDataDashboard';

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
                        <Route path="student/create-bulk-student" element={<BulkUploadStudent />} />
                        <Route path="student/:id" element={<StudentDetail />} />

                        {/* Faculty Screens */}
                        <Route path="faculty" element={<FacultyDashboard />} />
                        <Route path="faculty/create-faculty" element={<CreateFaculty />} />
                        <Route path="faculty/:id" element={<FacultyDetail />} />

                        {/* Exam Screens */}
                        <Route path="exam" element={<ExamDashboard />} />
                        <Route path="exam/all-exam" element={<AllExam />} />
                        <Route path="exam/create-exam" element={<CreateExam />} />

                        {/* MasterData Screens */}
                        <Route path="data" element={<MasterDataDashboard />} />                        

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;