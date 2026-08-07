import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { Mail } from "lucide-react";
import { Link } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import Login from "../../../../assets/images/Login.png";
import { forgotPasswordValidationSchema } from "../formik/forgot-password.schema";
import { useForgotPasswordMutation } from "../../../../state/services/endpoints/auth";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const initialValues: ForgotPasswordFormValues = {
    email: '',
  };

  const handleSubmit = async (
    values: ForgotPasswordFormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const response = await forgotPassword(values).unwrap();
      toast.success(response.message || 'If this email is registered, a reset link has been generated.');
      resetForm();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to process forgot password request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full max-h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="flex flex-col justify-center items-center text-white w-full">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-20">
                <img src={Login} alt="Forgot Password" className="w-full h-auto" />
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/4 bg-gradient-to-b from-transparent via-neutral-300 to-transparent"></div>
        </div>

        {/* Right Column - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-neutral-900 mb-2">Forgot Password</h2>
              <p className="text-sm text-neutral-600">Enter your registered email address and we'll generate a password reset link</p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="space-y-4">
                    <InputField
                      id="email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Enter your registered email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      touched={touched.email}
                      icon={Mail}
                      required
                    />

                    <div className="mt-6">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSubmitting || isLoading}
                        disabled={isSubmitting || isLoading}
                        fullWidth
                      >
                        {isSubmitting || isLoading ? '' : 'Send Reset Link'}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Remembered your password?{' '}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline transition-colors duration-200"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
