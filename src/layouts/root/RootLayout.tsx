import { Outlet } from "react-router-dom";

export function RootLayout() {
    return (
        <div className="gird min-h-screen place-content-center">
            <Outlet />
        </div>
    );
}
