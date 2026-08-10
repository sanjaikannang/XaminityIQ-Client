import { useNavigate } from "react-router-dom";
import { User, BookOpen, Video, ClipboardList, type LucideIcon } from "lucide-react";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { getItemFromStorage } from "../../../../utils/storage";

interface QuickLink {
    label: string;
    description: string;
    path: string;
    icon: LucideIcon;
}

const quickLinks: QuickLink[] = [
    { label: "My Profile", description: "View your personal, contact and employment details", path: "/faculty/profile", icon: User },
    { label: "Subjects", description: "Browse subjects offered in your department", path: "/faculty/subjects", icon: BookOpen },
    { label: "Proctoring", description: "Manage your live exam rooms and admit students", path: "/faculty/proctoring", icon: Video },
    { label: "Evaluation", description: "Grade written answers for exams assigned to you", path: "/faculty/evaluation", icon: ClipboardList },
];

const FacultyDashboardPage = () => {
    const navigate = useNavigate();
    const userData = getItemFromStorage({ key: "user" }) as { email: string } | null;

    return (
        <>
            <PageHeader>Dashboard</PageHeader>
            <Container>
                <div className="space-y-6">
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <h1 className="text-xl font-bold text-textPrimary">Welcome back{userData?.email ? `, ${userData.email}` : ""}</h1>
                        <p className="text-sm text-textSecondary mt-1">Here's quick access to what you need.</p>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.path}
                                    type="button"
                                    onClick={() => navigate(link.path)}
                                    className="text-left bg-whiteColor rounded-xl border border-borderDefault p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="font-semibold text-textPrimary">{link.label}</p>
                                    <p className="text-sm text-textSecondary mt-1">{link.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </>
    );
};

export default FacultyDashboardPage;
