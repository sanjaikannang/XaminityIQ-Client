import { Outlet } from "react-router-dom";

export function StudentLayout() {
    return (
        <div className="gird min-h-screen place-content-center">
            <Outlet />
        </div>
    );
}
