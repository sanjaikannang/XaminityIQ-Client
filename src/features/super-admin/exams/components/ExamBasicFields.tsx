import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import { ExamMode } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";

const modeOptions = toEnumOptions(ExamMode);

interface ExamBasicFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}

const ExamBasicFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, disabled }: ExamBasicFieldsProps) => {
    return (
        <div className="space-y-4">
            <InputField
                id="name"
                name="name"
                label="Exam Name"
                placeholder="e.g., Mid Semester Examination"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                required
                disabled={disabled}
            />
            <InputField
                id="description"
                name="description"
                label="Description (Optional)"
                placeholder="Short description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                disabled={disabled}
            />
            <Select
                id="mode"
                name="mode"
                label="Examination Mode"
                options={modeOptions}
                value={values.mode}
                onChange={(value) => setFieldValue("mode", value)}
                error={errors.mode}
                touched={touched.mode}
                required
                disabled={disabled}
            />
        </div>
    );
};

export default ExamBasicFields;
