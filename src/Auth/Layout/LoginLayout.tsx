import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Login from "../../assets/Images/Login.png"
import { useAppDispatch } from '../../State/hooks';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { login } from '../../Services/Auth/authAPI';
import { tokenManager } from '../../Api/axios';
import { loginValidationSchema } from '../FormikSchema/login.schema';
import Spinner from '../../Common/UI/Spinner';

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginLayout: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const initialLoginValues: LoginFormValues = {
        email: '',
        password: ''
    };

    const handleLogin = async (
        values: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {

        try {
            // Call login API
            const response = await login(values);

            if (response.success) {
                // Store tokens and user data
                tokenManager.setTokens(
                    response.data.tokens.accessToken,
                    response.data.tokens.refreshToken,
                    response.data.sessionId
                );
                tokenManager.setUser(
                    response.data.user
                );

                // Update Redux state
                dispatch({
                    type: 'auth/loginSuccess',
                    payload: {
                        user: response.data.user,
                        isFirstLogin: response.data.user.isFirstLogin
                    }
                });

                // Navigate based on first login status
                if (response.data.user.isFirstLogin) {
                    navigate('/change-password');
                } else {
                    navigate('/dashboard');
                }
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (err: any) {
            console.error('Login error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
                {/* Main Card */}
                <div className="w-full max-w-7xl h-full max-h-[550px] bg-whiteColor rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
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

                            <Formik
                                initialValues={initialLoginValues}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleLogin}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
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
                                                    <Field
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                                {errors.email && touched.email && (
                                                    <p className="text-xs text-red-600">{errors.email}</p>
                                                )}
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
                                                    <Field
                                                        id="password"
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        placeholder="Enter your password"
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
                                                </div>
                                                {errors.password && touched.password && (
                                                    <p className="text-xs text-red-600">{errors.password}</p>
                                                )}
                                            </div>

                                            {/* Login Button */}
                                            <div className="mt-10">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner />
                                                        </>
                                                    ) : (
                                                        'Login'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

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