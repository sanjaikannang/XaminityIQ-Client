import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import OverviewSection from "../components/OverviewSection";
import FeaturesSection from "../components/FeaturesSection";
import RolesSection from "../components/RolesSection";
import WorkflowSection from "../components/WorkflowSection";
import ProctoringWorkflowSection from "../components/ProctoringWorkflowSection";
import QuestionTypesSection from "../components/QuestionTypesSection";
import SecuritySection from "../components/SecuritySection";
import PreviewSection from "../components/PreviewSection";
import BenefitsSection from "../components/BenefitsSection";
import CTASection from "../components/CTASection";
import LandingFooter from "../components/LandingFooter";

const LandingPage = () => {
    // Nav links point to /#section-id so they work from other public pages
    // (e.g. /documentation) too — React Router doesn't auto-scroll to a hash
    // on navigation, so do it once on mount.
    useEffect(() => {
        if (window.location.hash) {
            const el = document.getElementById(window.location.hash.slice(1));
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <div>
            <HeroSection />
            <OverviewSection />
            <FeaturesSection />
            <RolesSection />
            <WorkflowSection />
            <ProctoringWorkflowSection />
            <QuestionTypesSection />
            <SecuritySection />
            <PreviewSection />
            <BenefitsSection />
            <CTASection />
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
