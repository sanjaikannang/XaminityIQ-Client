import { Route, Routes } from 'react-router-dom';
import FacultyDashboard from '../Dashboard/FacultyDashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>

                        <Route index element={<FacultyDashboard />} />

                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;