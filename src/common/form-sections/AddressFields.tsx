import InputField from "../ui/Input";

interface AddressFieldsProps {
    prefix: string;
    title: string;
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
}

const AddressFields = ({ prefix, title, values, errors, touched, handleChange, handleBlur }: AddressFieldsProps) => {
    const address = values?.[prefix] || {};
    const addressErrors = errors?.[prefix] || {};
    const addressTouched = touched?.[prefix] || {};

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-textSecondary">{title}</h4>
            <InputField
                id={`${prefix}.addressLine1`}
                name={`${prefix}.addressLine1`}
                label="Address Line 1"
                placeholder="House/Flat No., Street"
                value={address.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={addressErrors.addressLine1}
                touched={addressTouched.addressLine1}
                required
            />
            <InputField
                id={`${prefix}.addressLine2`}
                name={`${prefix}.addressLine2`}
                label="Address Line 2"
                placeholder="Locality, Landmark (optional)"
                value={address.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={addressErrors.addressLine2}
                touched={addressTouched.addressLine2}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    id={`${prefix}.city`}
                    name={`${prefix}.city`}
                    label="City"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressErrors.city}
                    touched={addressTouched.city}
                    required
                />
                <InputField
                    id={`${prefix}.state`}
                    name={`${prefix}.state`}
                    label="State"
                    placeholder="State"
                    value={address.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressErrors.state}
                    touched={addressTouched.state}
                    required
                />
                <InputField
                    id={`${prefix}.pincode`}
                    name={`${prefix}.pincode`}
                    label="Pincode"
                    placeholder="6-digit pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={addressErrors.pincode}
                    touched={addressTouched.pincode}
                    required
                />
            </div>
        </div>
    );
};

export default AddressFields;
