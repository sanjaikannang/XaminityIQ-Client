import AddressFields from "./AddressFields";

interface AddressSectionProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const AddressSection = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: AddressSectionProps) => {
    return (
        <div className="space-y-6">
            <AddressFields
                prefix="currentAddress"
                title="Current Address"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />

            <label className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
                <input
                    type="checkbox"
                    checked={!!values.sameAsCurrent}
                    onChange={(e) => setFieldValue("sameAsCurrent", e.target.checked)}
                    className="h-4 w-4 rounded border-borderLight"
                />
                Permanent address is the same as current address
            </label>

            {!values.sameAsCurrent && (
                <AddressFields
                    prefix="permanentAddress"
                    title="Permanent Address"
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                />
            )}
        </div>
    );
};

export default AddressSection;
