import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const CTASection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-bgSecondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-sky-600 px-6 sm:px-12 py-14 sm:py-16 text-center shadow-2xl">
                        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-whiteColor/10" />
                        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-whiteColor/10" />
                        <div className="relative">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-whiteColor">
                                Ready to run your next exam with XaminityIQ?
                            </h2>
                            <p className="mt-3 text-whiteColor/85 max-w-xl mx-auto">
                                Sign in with your institution account to get started — Admin, Faculty, and Student access all live in one place.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-medium bg-whiteColor text-primary hover:bg-whiteColor/90 transition-colors duration-200"
                                >
                                    Login to XaminityIQ <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default CTASection;
