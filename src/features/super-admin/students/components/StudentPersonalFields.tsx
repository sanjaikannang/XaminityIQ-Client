import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import { Gender } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";

interface StudentPersonalFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const genderOptions = toEnumOptions(Gender);

const StudentPersonalFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: StudentPersonalFieldsProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    placeholder="First name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                />
                <InputField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lastName}
                    touched={touched.lastName}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    id="gender"
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    value={values.gender}
                    onChange={(value) => setFieldValue("gender", value)}
                    error={errors.gender}
                    touched={touched.gender}
                    required
                />
                <InputField
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="text"
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dateOfBirth}
                    touched={touched.dateOfBirth}
                    required
                />
                <InputField
                    id="religion"
                    name="religion"
                    label="Religion"
                    placeholder="Religion (optional)"
                    value={values.religion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.religion}
                    touched={touched.religion}
                />
            </div>
            <InputField
                id="profilePhotoUrl"
                name="profilePhotoUrl"
                label="Profile Photo URL"
                placeholder="https://..."
                value={values.profilePhotoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.profilePhotoUrl}
                touched={touched.profilePhotoUrl}
                required
            />
        </div>
    );
};

export default StudentPersonalFields;
