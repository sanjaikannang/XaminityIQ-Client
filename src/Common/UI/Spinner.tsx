const Spinner = ({ borderColor = "white" }) => {
    return (
        <>
            <div className="flex items-center justify-center h-full">
                <div className={`w-6 h-6 border-2 border-${borderColor} border-t-transparent rounded-full animate-spin`}></div>
            </div>
        </>
    )
}

export default Spinner