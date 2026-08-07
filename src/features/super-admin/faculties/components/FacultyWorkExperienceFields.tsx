import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";

interface FacultyWorkExperienceFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const emptyWorkExperience = {
    organization: "",
    role: "",
    department: "",
    fromDate: "",
    toDate: "",
    experienceYears: "",
    jobDescription: "",
    reasonForLeaving: "",
    isCurrent: false,
};

const FacultyWorkExperienceFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: FacultyWorkExperienceFieldsProps) => {
    const workExperience = values.workExperience || [];

    return (
        <FieldArray name="workExperience">
            {({ push, remove }) => (
                <div className="space-y-6">
                    {workExperience.length === 0 && (
                        <p className="text-sm text-textTertiary">No prior work experience added (optional).</p>
                    )}

                    {workExperience.map((_: any, index: number) => {
                        const itemErrors = (errors.workExperience?.[index] as any) || {};
                        const itemTouched = (touched.workExperience?.[index] as any) || {};

                        return (
                            <div key={index} className="p-4 border border-borderLight rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-semibold text-textSecondary">Work Experience {index + 1}</h5>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField
                                        id={`workExperience.${index}.organization`}
                                        name={`workExperience.${index}.organization`}
                                        label="Organization"
                                        value={workExperience[index].organization}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.organization}
                                        touched={itemTouched.organization}
                                        required
                                    />
                                    <InputField
                                        id={`workExperience.${index}.role`}
                                        name={`workExperience.${index}.role`}
                                        label="Role"
                                        value={workExperience[index].role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.role}
                                        touched={itemTouched.role}
                                        required
                                    />
                                    <InputField
                                        id={`workExperience.${index}.department`}
                                        name={`workExperience.${index}.department`}
                                        label="Department"
                                        placeholder="Optional"
                                        value={workExperience[index].department}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.department}
                                        touched={itemTouched.department}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField
                                        id={`workExperience.${index}.fromDate`}
                                        name={`workExperience.${index}.fromDate`}
                                        type="text"
                                        label="From Date"
                                        placeholder="YYYY-MM-DD"
                                        value={workExperience[index].fromDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.fromDate}
                                        touched={itemTouched.fromDate}
                                        required
                                    />
                                    <InputField
                                        id={`workExperience.${index}.toDate`}
                                        name={`workExperience.${index}.toDate`}
                                        type="text"
                                        label="To Date"
                                        placeholder="YYYY-MM-DD"
                                        value={workExperience[index].toDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.toDate}
                                        touched={itemTouched.toDate}
                                        required
                                    />
                                    <InputField
                                        id={`workExperience.${index}.experienceYears`}
                                        name={`workExperience.${index}.experienceYears`}
                                        type="number"
                                        label="Experience (years)"
                                        value={workExperience[index].experienceYears}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.experienceYears}
                                        touched={itemTouched.experienceYears}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        id={`workExperience.${index}.jobDescription`}
                                        name={`workExperience.${index}.jobDescription`}
                                        label="Job Description"
                                        placeholder="Optional"
                                        value={workExperience[index].jobDescription}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.jobDescription}
                                        touched={itemTouched.jobDescription}
                                    />
                                    <InputField
                                        id={`workExperience.${index}.reasonForLeaving`}
                                        name={`workExperience.${index}.reasonForLeaving`}
                                        label="Reason for Leaving"
                                        placeholder="Optional"
                                        value={workExperience[index].reasonForLeaving}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={itemErrors.reasonForLeaving}
                                        touched={itemTouched.reasonForLeaving}
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!workExperience[index].isCurrent}
                                        onChange={(e) => setFieldValue(`workExperience.${index}.isCurrent`, e.target.checked)}
                                        className="h-4 w-4 rounded border-borderLight"
                                    />
                                    This is the current organization
                                </label>
                            </div>
                        );
                    })}

                    <Button type="button" variant="outline" size="sm" icon={Plus} onClick={() => push({ ...emptyWorkExperience })}>
                        Add Work Experience
                    </Button>
                </div>
            )}
        </FieldArray>
    );
};

export default FacultyWorkExperienceFields;
