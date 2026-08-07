import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { Lock } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import Login from "../../../../assets/images/Login.png";
import { resetPasswordWithTokenValidationSchema } from "../formik/reset-password-with-token.schema";
import { useResetPasswordMutation } from "../../../../state/services/endpoints/auth";

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const initialValues: ResetPasswordFormValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: ResetPasswordFormValues,
    { setSubmitting }: any
  ) => {
    if (!token) {
      toast.error('Reset link is invalid or has expired');
      setSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword({ token, ...values }).unwrap();
      toast.success(response.message || 'Password has been reset successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reset password');
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
                <img src={Login} alt="Reset Password" className="w-full h-auto" />
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/4 bg-gradient-to-b from-transparent via-neutral-300 to-transparent"></div>
        </div>

        {/* Right Column - Reset Password Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-neutral-900 mb-2">Reset Password</h2>
              <p className="text-sm text-neutral-600">Enter your new password below</p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={resetPasswordWithTokenValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="space-y-4">
                    <InputField
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      label="New Password"
                      placeholder="Enter your new password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.newPassword}
                      touched={touched.newPassword}
                      icon={Lock}
                      showPasswordToggle
                      required
                    />

                    <InputField
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Re-enter your new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      icon={Lock}
                      showPasswordToggle
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
                        {isSubmitting || isLoading ? '' : 'Reset Password'}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
