import unauthorizedGif from "../../../../assets/gifs/401.gif";

const UnAuthorizedPage = () => {
    return (
        <>
            <div className="h-screen flex flex-col">
                {/* Centered content */}
                <div className="flex flex-1 items-center justify-center">
                    <img
                        src={unauthorizedGif}
                        alt="Unauthorized Access"
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Branding footer */}
                <div className="pb-4">
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
        </>
    );
};

export default UnAuthorizedPage;
