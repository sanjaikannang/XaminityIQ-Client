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
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-whiteColor rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <p className="mb-6 leading-relaxed">
                            XaminityIQ is optimized for tablet and desktop devices.
                            Please access this application on a device with a screen
                            width of at least 768px for the best experience.
                        </p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithScreenGuard.displayName = `withScreenGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithScreenGuard;
}