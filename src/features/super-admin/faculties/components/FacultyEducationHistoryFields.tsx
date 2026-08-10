import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import { EducationLevel } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";

interface FacultyEducationHistoryFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const emptyEducationRecord = {
    level: "",
    qualification: "",
    boardOrUniversity: "",
    institutionName: "",
    yearOfPassing: "",
    percentageOrCGPA: "",
    specialization: "",
};

const levelOptions = toEnumOptions(EducationLevel);

const FacultyEducationHistoryFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: FacultyEducationHistoryFieldsProps) => {
    const educationHistory = values.educationHistory || [];

    return (
        <FieldArray name="educationHistory">
            {({ push, remove }) => (
                <div className="space-y-6">
                    {educationHistory.map((_: any, index: number) => {
                        const itemErrors = (errors.educationHistory?.[index] as any) || {};
                        const itemTouched = (touched.educationHistory?.[index] as any) || {};

                        return (
                            <div key={index} className="p-4 border border-borderLight rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-semibold text-textSecondary">Education Record {index + 1}</h5>
                                    {educationHistory.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-600 hover:text-red-700 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Select
                                        id={`educationHistory.${index}.level`}
                                        name={`educationHistory.${index}.level`}
                                        label="Level"
                                        options={levelOptions}
                                        value={educationHistory[index].level}
                                        onChange={(value) => setFieldValue(`educationHistory.${index}.level`, value)}
                                        error={itemErrors.level}
                                        touched={itemTouched.level}
                                        required
                                    />
                                    <InputField
                                        id={`educationHistory.${index}.qualification`}
                                        name={`educationHistory.${index}.qualification`}
                                        label="Qualification"
                                        placeholder="e.g. PhD"
                                        value={educationHistory[index].qualification}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.qualification}
                                        touched={itemTouched.qualification}
                                        required
                                    />
                                    <InputField
                                        id={`educationHistory.${index}.boardOrUniversity`}
                                        name={`educationHistory.${index}.boardOrUniversity`}
                                        label="Board / University"
                                        value={educationHistory[index].boardOrUniversity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.boardOrUniversity}
                                        touched={itemTouched.boardOrUniversity}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <InputField
                                        id={`educationHistory.${index}.institutionName`}
                                        name={`educationHistory.${index}.institutionName`}
                                        label="Institution Name"
                                        value={educationHistory[index].institutionName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.institutionName}
                                        touched={itemTouched.institutionName}
                                        required
                                    />
                                    <InputField
                                        id={`educationHistory.${index}.yearOfPassing`}
                                        name={`educationHistory.${index}.yearOfPassing`}
                                        type="number"
                                        label="Year of Passing"
                                        value={educationHistory[index].yearOfPassing}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.yearOfPassing}
                                        touched={itemTouched.yearOfPassing}
                                        required
                                    />
                                    <InputField
                                        id={`educationHistory.${index}.percentageOrCGPA`}
                                        name={`educationHistory.${index}.percentageOrCGPA`}
                                        type="number"
                                        label="Percentage / CGPA"
                                        value={educationHistory[index].percentageOrCGPA}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.percentageOrCGPA}
                                        touched={itemTouched.percentageOrCGPA}
                                        required
                                    />
                                    <InputField
                                        id={`educationHistory.${index}.specialization`}
                                        name={`educationHistory.${index}.specialization`}
                                        label="Specialization"
                                        placeholder="Optional"
                                        value={educationHistory[index].specialization}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.specialization}
                                        touched={itemTouched.specialization}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <Button type="button" variant="outline" size="sm" icon={Plus} onClick={() => push({ ...emptyEducationRecord })}>
                        Add Education Record
                    </Button>
                </div>
            )}
        </FieldArray>
    );
};

export default FacultyEducationHistoryFields;
