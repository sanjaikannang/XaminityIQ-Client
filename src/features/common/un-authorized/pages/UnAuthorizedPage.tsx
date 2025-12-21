import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { ShieldX } from "lucide-react";

const UnAuthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <ShieldX className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-neutral-900 mb-4">403</h1>
                    <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-neutral-600 mb-8">
                        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
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

export default UnAuthorizedPage;