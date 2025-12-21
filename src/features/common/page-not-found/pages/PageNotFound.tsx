import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center">
                            <FileQuestion className="w-12 h-12 text-sky-600" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-neutral-600 mb-8">
                        The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to safety.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageNotFound;