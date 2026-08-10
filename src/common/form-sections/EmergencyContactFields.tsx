import InputField from "../ui/Input";
import Select from "../ui/Select";
import { RelationType } from "../../utils/enum";
import { toEnumOptions } from "../../utils/utils";

interface EmergencyContactFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const relationOptions = toEnumOptions(RelationType);

const EmergencyContactFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: EmergencyContactFieldsProps) => {
    const contact = values?.emergencyContact || {};
    const contactErrors = errors?.emergencyContact || {};
    const contactTouched = touched?.emergencyContact || {};

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-textSecondary">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    id="emergencyContact.name"
                    name="emergencyContact.name"
                    label="Name"
                    placeholder="Contact name"
                    value={contact.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={contactErrors.name}
                    touched={contactTouched.name}
                    required
                />
                <Select
                    id="emergencyContact.relation"
                    name="emergencyContact.relation"
                    label="Relation"
                    options={relationOptions}
                    value={contact.relation}
                    onChange={(value) => setFieldValue("emergencyContact.relation", value)}
                    error={contactErrors.relation}
                    touched={contactTouched.relation}
                    required
                />
                <InputField
                    id="emergencyContact.phoneNumber"
                    name="emergencyContact.phoneNumber"
                    label="Phone Number"
                    placeholder="+91XXXXXXXXXX"
                    value={contact.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={contactErrors.phoneNumber}
                    touched={contactTouched.phoneNumber}
                    required
                />
            </div>
        </div>
    );
};

export default EmergencyContactFields;
