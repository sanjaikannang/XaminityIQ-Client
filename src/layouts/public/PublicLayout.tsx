import { Outlet, Link } from "react-router-dom";

const PublicLayout = () => {
    return (
        <>
            <div className="min-h-screen">
                <nav className="fixed top-0 left-0 right-0 bg-whiteColor shadow-sm z-50">
                    <div className="max-full mx-auto px-4">
                        <div className="flex justify-between items-center h-16">
                            <Link to="/" className="text-xl font-bold">
                                XaminityIQ
                            </Link>

                            <div className="flex items-center gap-4">
                                <Link
                                    to="/documentation"
                                    className="px-4 py-1 bg-primary text-whiteColor rounded-lg hover:scale-105"
                                >
                                    Documentation
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-4 py-1 bg-primary text-whiteColor rounded-lg hover:scale-105"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="pt-16">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default PublicLayout;