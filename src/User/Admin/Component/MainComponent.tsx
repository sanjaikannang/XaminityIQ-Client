import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';
import FacultyDashboard from '../Dashboard/FacultyDashboard';
import ExamDashboard from '../Dashboard/ExamDashboard';
import CreateStudent from './CreateStudent';
import CreateFaculty from './CreateFaculty';
import StudentDetail from './StudentDetail';
import FacultyDetail from './FacultyDetail';
import AllExam from './AllExam';
import CreateExam from './Exam/CreateExam/CreateExam';
import MasterDataDashboard from '../Dashboard/MasterDataDashboard';
import ViewBatch from './MasterData/_Component/ViewBatch';
import ViewCourse from './MasterData/_Component/ViewCourse';
import ViewBranch from './MasterData/_Component/ViewBranch';
import ViewSection from './MasterData/_Component/ViewSection';
import Exam from './Exam/Exam';

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

                        {/* Exam Screens */}
                        <Route path="exam" element={<ExamDashboard />} />
                        <Route path="exam/all-exam" element={<AllExam />} />
                        <Route path="exam/create-exam" element={<CreateExam />} />
                        <Route path="exam/exam-ui" element={<Exam />} />

                        {/* MasterData Screens */}
                        <Route path="data" element={<MasterDataDashboard />} />
                        <Route path="data/view-batch" element={<ViewBatch />} />
                        <Route path="data/view-course" element={<ViewCourse />} />
                        <Route path="data/view-branch" element={<ViewBranch />} />
                        <Route path="data/view-section" element={<ViewSection />} />

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;