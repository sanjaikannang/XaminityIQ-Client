import { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Login from "../../assets/Images/Login.png"
import { useAppDispatch, useAppSelector } from '../../State/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearError, loginUser } from '../../State/Slices/authSlice';

const LoginLayout: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation()

    const { isLoading, error, isAuthenticated, isFirstLogin } = useAppSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    // Clear error when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Redirect after successful login
    useEffect(() => {
        if (isAuthenticated) {
            if (isFirstLogin) {
                navigate('/change-password');
            } else {
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, isFirstLogin, navigate, location.state]);

    const validateForm = () => {
        const errors = { email: '', password: '' };
        let isValid = true;

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear global error
        if (error) {
            dispatch(clearError());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(loginUser(formData));
    };

    return (
        <>
            <div className="h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
                {/* Main Card */}
                <div className="w-full max-w-7xl h-full max-h-[600px] bg-whiteColor rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Column - Image */}
                    <div className="hidden lg:flex lg:w-1/2 relative">
                        <div className="flex flex-col justify-center items-center text-whiteColor w-full">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center p-20">
                                    <img src={Login} alt="Login" />
                                </div>
                            </div>
                        </div>
                        {/* Separator Line */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/4 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Right Column - Login Form */}
                    <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                        <div className="w-full max-w-lg">
                            {/* Login Form */}
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Login</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                            {formErrors.email && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400" />
                                                )}
                                            </button>
                                            {formErrors.password && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Login Button */}
                                    <div className="mt-10">
                                        <button
                                            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg"
                                        >
                                            {isLoading ? (
                                                "Logging In..."
                                            ) : ("Login")
                                            }
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button className="text-primary font-medium transition-colors duration-200">
                                        Contact Admin
                                    </button>
                                </p>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    Secure exams with advanced proctoring by{' '}
                                    <span className="text-primary font-semibold">XaminityIQ</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginLayout;