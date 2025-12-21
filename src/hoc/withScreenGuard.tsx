import { Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";

export function withScreenGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithScreenGuard: React.FC<P> = (props) => {
        const [isLargeScreen, setIsLargeScreen] = useState(
            window.innerWidth >= 768
        );

        useEffect(() => {
            const handleResize = () => {
                setIsLargeScreen(window.innerWidth >= 768);
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        if (!isLargeScreen) {
            return (
                <>
                    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
                        <div className="bg-whiteColor rounded-xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
                            {/* Icon container */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    {/* Pulsing background */}
                                    <div className="absolute inset-0 bg-primaryLight rounded-full animate-ping opacity-75"></div>

                                    {/* Icon circle */}
                                    <div className="relative bg-primary rounded-full p-6">
                                        <Smartphone className="w-12 h-12 text-whiteColor" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>                          

                            {/* Heading */}
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                                Optimized for Larger Screens !
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
                                XaminityIQ delivers the best experience on tablet and desktop devices.
                                Please switch to a larger screen to access all features.
                            </p>

                            {/* Branding footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2">                                    
                                    <span className="text-sm text-gray-500">
                                        Powered by{' '}
                                        <span className="font-semibold text-primary">
                                            XaminityIQ
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithScreenGuard.displayName = `withScreenGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithScreenGuard;
}