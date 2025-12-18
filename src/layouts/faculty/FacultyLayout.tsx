import { Outlet } from "react-router-dom";

export function FacultyLayout() {
    return (
        <div className="gird min-h-screen place-content-center">
            <Outlet />
        </div>
    );
}
