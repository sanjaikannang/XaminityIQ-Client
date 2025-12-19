import Password from "../../../../assets/images/ResetPassword.png";

const ResetPassword = () => {
    return (
        <>
            <div className="h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
                <div className="w-full max-w-7xl h-full max-h-[550px] bg-whiteColor rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Column - Image */}
                    <div className="hidden lg:flex lg:w-1/2 relative">
                        <div className="flex flex-col justify-center items-center text-whiteColor w-full">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center p-20">
                                    <img src={Password} alt="ResetPassword" />
                                </div>
                            </div>
                        </div>
                        {/* Separator Line */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/4 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Right Column - Login Form */}
                    <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                        <div className="w-full max-w-lg text-center">
                            Reset Password Form Goes Here
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;