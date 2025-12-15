import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="gird min-h-screen place-content-center">
            <Outlet />
        </div>
    );
}
