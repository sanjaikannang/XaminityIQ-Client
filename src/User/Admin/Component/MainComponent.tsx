import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />                       
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;