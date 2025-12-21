import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { Mail, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { UserRole } from "../../../../utils/enum";
import InputField from "../../../../common/ui/Input";
import Login from "../../../../assets/images/Login.png";
import { setItemInStorage } from "../../../../utils/storage";
import { loginValidationSchema } from "../formik/login.schema";
import { navigateByUserRole } from "../../../../utils/navigation";
import { useLoginMutation } from "../../../../state/services/endpoints/auth";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const initialValues: LoginFormValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const response = await login(values).unwrap();

      if (response.data.tokens) {
        if (response.data.tokens) {
          setItemInStorage({
            key: 'accessToken',
            value: response.data.tokens.accessToken,
          });

          setItemInStorage({
            key: 'refreshToken',
            value: response.data.tokens.refreshToken,
          });

          setItemInStorage({
            key: 'user',
            value: response.data.user,
          });

          setItemInStorage({
            key: 'userRole',
            value: response.data.user.role,
          });
        }
      }

      toast.success(response.message || 'Login successful!');

      if (response.data.user.isFirstLogin) {
        navigate('/reset-password');
      } else {
        const userRole = response.data.user.role as UserRole;
        navigateByUserRole(userRole, navigate);
      }

    } catch (error: any) {
      console.log('Login error:', error);
      toast.error(error.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl h-full max-h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Column - Image */}
          <div className="hidden lg:flex lg:w-1/2 relative">
            <div className="flex flex-col justify-center items-center text-white w-full">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-20">
                  <img src={Login} alt="Login" className="w-full h-auto" />
                </div>
              </div>
            </div>
            {/* Separator Line */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/4 bg-gradient-to-b from-transparent via-neutral-300 to-transparent"></div>
          </div>

          {/* Right Column - Login Form */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-lg">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-semibold text-neutral-900 mb-2">Login</h2>
                <p className="text-sm text-neutral-600">Enter your credentials to access your account</p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                  <Form>
                    <div className="space-y-4">
                      {/* Email Field */}
                      <InputField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        icon={Mail}
                        required
                      />

                      {/* Password Field */}
                      <InputField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                        icon={Lock}
                        showPasswordToggle
                        required
                      />

                      {/* Login Button */}
                      <div className="mt-6">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          loading={isSubmitting || isLoading}
                          disabled={isSubmitting || isLoading}
                          fullWidth
                        >
                          {isSubmitting || isLoading ? '' : 'Login'}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>

              {/* Footer Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline transition-colors duration-200"
                  >
                    Contact Admin
                  </button>
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-neutral-500">
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

export default LoginPage;