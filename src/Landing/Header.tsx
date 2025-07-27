import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <header className="bg-whiteColor shadow-md h-16 flex items-center justify-between px-6">
                {/* Left side */}
                <div className="flex font-semibold items-center space-x-2">
                    <h1>XaminityIQ</h1>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleLogin}
                        className="px-6 py-1 rounded-3xl bg-primary text-whiteColor cursor-pointer">
                        Login
                    </button>                    
                </div>
            </header>
        </>
    )
}

export default Header