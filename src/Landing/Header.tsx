import { useNavigate } from "react-router-dom";
import Logo from "../assets/Images/logo.png"

const Header = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <header className="bg-whiteColor shadow-md h-18 flex items-center justify-between px-6">
                {/* Left side */}
                <div className="flex font-semibold items-center space-x-2">
                    <img src={Logo} alt="Logo" className="h-16" />
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleLogin}
                        className="px-6 py-1 rounded-lg bg-primary text-whiteColor cursor-pointer">
                        Login
                    </button>                    
                </div>
            </header>
        </>
    )
}

export default Header