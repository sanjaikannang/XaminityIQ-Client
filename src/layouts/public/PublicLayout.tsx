import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/#home" },
    { label: "Features", href: "/#features" },
    { label: "Roles", href: "/#roles" },
    { label: "Workflow", href: "/#workflow" },
    { label: "Proctoring", href: "/#proctoring" },
    { label: "About", href: "/#overview" },
];

const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lock body scroll while the full-screen mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <div className="min-h-screen">
            <nav className="fixed top-0 left-0 right-0 bg-whiteColor shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-1.5 text-lg font-bold text-textPrimary shrink-0">
                            <ShieldCheck className="w-5 h-5 text-primary" /> XaminityIQ
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-textSecondary hover:text-primary hover:bg-bgSecondary transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-textSecondary hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link to="/login" className="px-4 py-2 bg-primary text-whiteColor text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((v) => !v)}
                            className="lg:hidden p-2 rounded-lg text-textSecondary hover:bg-bgSecondary transition-colors cursor-pointer z-50 relative"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full-screen mobile menu overlay */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-40 bg-whiteColor flex flex-col overflow-y-auto">
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full max-w-xs text-center px-4 py-3.5 rounded-xl text-lg font-semibold text-textPrimary hover:text-primary hover:bg-bgSecondary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="px-6 pb-10 pt-4 border-t border-borderLight flex flex-col gap-3 max-w-xs w-full mx-auto">
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-3.5 rounded-xl text-base font-semibold text-center text-textPrimary border border-borderLight hover:bg-bgSecondary transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-3.5 bg-primary text-whiteColor text-base font-semibold rounded-xl text-center hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}

            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
