import unauthorizedGif from "../../../../assets/gifs/401.gif";

const UnAuthorizedPage = () => {
    return (
        <>
            <div className="h-screen flex items-center justify-center">
                <img
                    src={unauthorizedGif}
                    alt="Unauthorized Access"
                    className="max-w-full h-auto"
                />
            </div>
        </>
    );
};

export default UnAuthorizedPage;
