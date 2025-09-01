import { Route, Routes } from 'react-router-dom';
import StudentDashboard from '../Dashboard/StudentDashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>

                        <Route index element={<StudentDashboard />} />

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;