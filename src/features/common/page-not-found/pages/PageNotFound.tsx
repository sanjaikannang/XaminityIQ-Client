import pageNotFoundGif from "../../../../assets/gifs/404.gif";

const PageNotFound = () => {
    return (
        <>
            <div className="h-screen flex items-center justify-center">
                <img
                    src={pageNotFoundGif}
                    alt="Page Not Found"
                    className="max-w-full h-auto"
                />
            </div>
        </>
    );
};

export default PageNotFound;