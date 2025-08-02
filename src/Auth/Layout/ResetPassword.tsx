import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ResetPassword from "../../assets/Images/Reset Password.png"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { resetPasswordValidationSchema } from '../FormikSchema/reset-password.schema';
import Spinner from '../../Common/UI/Spinner';
import { changePassword } from '../../Services/Auth/authAPI';
import toast from 'react-hot-toast';
import { setFirstLoginComplete } from '../../State/Slices/authSlice';

interface ResetPasswordFormValues {
    email: string;
    temporaryPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ResetPasswordLayout: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialResetPasswordValues: ResetPasswordFormValues = {
        email: '',
        temporaryPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    const handleResetPassword = async (
        values: ResetPasswordFormValues,
        { setSubmitting }: FormikHelpers<ResetPasswordFormValues>
    ) => {
        try {
            // Map form values to API request format
            const changePasswordData = {
                email: values.email,
                currentPassword: values.temporaryPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            // Call reset password API
            const response = await changePassword(changePasswordData);

            if (response.success) {
                toast.success('Password changed successfully!');

                // Update Redux state to mark first login as complete
                dispatch(setFirstLoginComplete());

                // Navigate to login page or dashboard
                navigate('/login');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred';

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    }

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
                                    <img src={ResetPassword} alt="ResetPassword" />
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
                                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Reset Password</h2>
                            </div>

                            <Formik
                                initialValues={initialResetPasswordValues}
                                validationSchema={resetPasswordValidationSchema}
                                onSubmit={handleResetPassword}
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

                                            {/* Temporary Password Field */}
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Temporary Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Field
                                                        id="temporaryPassword"
                                                        name="temporaryPassword"
                                                        type={showTempPassword ? 'text' : 'password'}
                                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        placeholder="Enter Temporary Password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowTempPassword(!showTempPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                                                    >
                                                        {showTempPassword ? (
                                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.temporaryPassword && touched.temporaryPassword && (
                                                    <p className="text-xs text-red-600">{errors.temporaryPassword}</p>
                                                )}
                                            </div>

                                            {/* New Password Field */}
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Field
                                                        id="newPassword"
                                                        name="newPassword"
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        placeholder="Enter New Password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.newPassword && touched.newPassword && (
                                                    <p className="text-xs text-red-600">{errors.newPassword}</p>
                                                )}
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Field
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && touched.confirmPassword && (
                                                    <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                                                )}
                                            </div>

                                            {/* Login Button */}
                                            <div className="mt-10">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner />
                                                        </>
                                                    ) : (
                                                        'Reset Password'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

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

export default ResetPasswordLayout;