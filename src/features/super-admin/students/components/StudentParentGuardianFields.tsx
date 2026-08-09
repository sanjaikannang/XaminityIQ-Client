import InputField from "../../../../common/ui/Input";

interface StudentParentGuardianFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
}

const StudentParentGuardianFields = ({ values, errors, touched, handleChange, handleBlur }: StudentParentGuardianFieldsProps) => {
    const renderGroup = (prefix: "father" | "mother" | "guardian", title: string, showRelation: boolean) => {
        const group = values?.[prefix] || {};
        const groupErrors = errors?.[prefix] || {};
        const groupTouched = touched?.[prefix] || {};

        return (
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-textSecondary">{title} (optional)</h4>
                <div className={`grid grid-cols-1 gap-4 ${showRelation ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                    <InputField
                        id={`${prefix}.name`}
                        name={`${prefix}.name`}
                        label="Name"
                        value={group.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={groupErrors.name}
                        touched={groupTouched.name}
                    />
                    {showRelation && (
                        <InputField
                            id={`${prefix}.relation`}
                            name={`${prefix}.relation`}
                            label="Relation"
                            placeholder="e.g. Uncle"
                            value={group.relation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={groupErrors.relation}
                            touched={groupTouched.relation}
                        />
                    )}
                    <InputField
                        id={`${prefix}.phoneNumber`}
                        name={`${prefix}.phoneNumber`}
                        label="Phone Number"
                        placeholder="+91XXXXXXXXXX"
                        value={group.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={groupErrors.phoneNumber}
                        touched={groupTouched.phoneNumber}
                    />
                    <InputField
                        id={`${prefix}.email`}
                        name={`${prefix}.email`}
                        type="email"
                        label="Email"
                        value={group.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={groupErrors.email}
                        touched={groupTouched.email}
                    />
                </div>
                <InputField
                    id={`${prefix}.occupation`}
                    name={`${prefix}.occupation`}
                    label="Occupation"
                    value={group.occupation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={groupErrors.occupation}
                    touched={groupTouched.occupation}
                />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {renderGroup("father", "Father's Details", false)}
            {renderGroup("mother", "Mother's Details", false)}
            {renderGroup("guardian", "Guardian's Details", true)}
        </div>
    );
};

export default StudentParentGuardianFields;
