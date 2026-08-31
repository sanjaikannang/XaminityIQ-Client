import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const LINK_GROUPS = [
    {
        title: "Explore",
        links: [
            { label: "Overview", href: "#overview" },
            { label: "Features", href: "#features" },
            { label: "Roles", href: "#roles" },
            { label: "Workflow", href: "#workflow" },
            { label: "Proctoring", href: "#proctoring" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Login", to: "/login" },
        ],
    },
];

const LandingFooter = () => {
    return (
        <footer className="bg-textPrimary text-whiteColor/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-whiteColor font-bold text-lg">
                            <ShieldCheck className="w-5 h-5 text-primary" /> XaminityIQ
                        </div>
                        <p className="mt-3 text-sm leading-relaxed max-w-xs">
                            A complete academic examination platform — from academic setup to secure, proctored exams.
                        </p>
                    </div>
                    {LINK_GROUPS.map((group) => (
                        <div key={group.title}>
                            <p className="text-whiteColor text-sm font-semibold mb-3">{group.title}</p>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        {"href" in link ? (
                                            <a href={link.href} className="text-sm hover:text-whiteColor transition-colors">{link.label}</a>
                                        ) : (
                                            <Link to={link.to} className="text-sm hover:text-whiteColor transition-colors">{link.label}</Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-10 pt-6 border-t border-whiteColor/10 text-xs text-center sm:text-left">
                    © {new Date().getFullYear()} XaminityIQ. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
