import InputField from "../../../../common/ui/Input";
import EmergencyContactFields from "../../../../common/form-sections/EmergencyContactFields";

interface StudentContactFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    studentEmail?: string;
}

const StudentContactFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, studentEmail }: StudentContactFieldsProps) => {
    return (
        <div className="space-y-4">
            {studentEmail && (
                <InputField
                    id="studentEmail"
                    name="studentEmail"
                    label="Student Email (auto-generated, read-only)"
                    value={studentEmail}
                    disabled
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="personalEmail"
                    name="personalEmail"
                    type="email"
                    label="Personal Email"
                    placeholder="Personal email address"
                    value={values.personalEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.personalEmail}
                    touched={touched.personalEmail}
                    required
                />
                <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="+91XXXXXXXXXX"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.phoneNumber}
                    touched={touched.phoneNumber}
                    required
                />
            </div>
            <InputField
                id="alternatePhoneNumber"
                name="alternatePhoneNumber"
                label="Alternate Phone Number"
                placeholder="+91XXXXXXXXXX (optional)"
                value={values.alternatePhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.alternatePhoneNumber}
                touched={touched.alternatePhoneNumber}
            />
            <EmergencyContactFields
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
            />
        </div>
    );
};

export default StudentContactFields;
