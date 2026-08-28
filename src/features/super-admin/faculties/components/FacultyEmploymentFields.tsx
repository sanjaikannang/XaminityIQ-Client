import { useMemo, useState } from "react";
import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import AsyncSelect, { type AsyncSelectOption } from "../../../../common/ui/AsyncSelect";
import { FacultyDesignation, EmploymentType, HighestQualification } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";
import { useAppDispatch } from "../../../../app/store/hooks";
import { createFlatLoadOptions } from "../../../../utils/asyncSelectHelpers";
import { academicsApiService } from "../../../../state/services/endpoints/academics";
import type { DepartmentInfo } from "../../../../types/academics-types";

interface FacultyEmploymentFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    // Display name for the faculty's current department — only available in
    // edit mode, since this component otherwise has no way to know it until
    // the (unpaginated) department list has loaded
    initialDepartmentName?: string;
    // 'create' hides totalExperienceYears and highestQualification — the
    // faculty member fills these in themselves later from their Dashboard
    // Profile page.
    mode?: 'create' | 'edit';
}

const designationOptions = toEnumOptions(FacultyDesignation);
const employmentTypeOptions = toEnumOptions(EmploymentType);
const highestQualificationOptions = toEnumOptions(HighestQualification);

const FacultyEmploymentFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, initialDepartmentName, mode = 'edit' }: FacultyEmploymentFieldsProps) => {
    const dispatch = useAppDispatch();

    const [departmentOption, setDepartmentOption] = useState<AsyncSelectOption | null>(
        () => (values.departmentId && initialDepartmentName ? { value: values.departmentId, label: initialDepartmentName } : null),
    );

    const loadDepartmentOptions = useMemo(() => createFlatLoadOptions<DepartmentInfo>({
        dispatch,
        initiate: academicsApiService.endpoints.getAllDepartments.initiate,
        mapItem: (d) => ({ value: d._id, label: d.deptName }),
    }), [dispatch]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="employeeId"
                    name="employeeId"
                    label="Employee ID"
                    placeholder="e.g. FAC2024001"
                    value={values.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.employeeId}
                    touched={touched.employeeId}
                    required
                />
                <AsyncSelect
                    id="departmentId"
                    label="Department"
                    value={departmentOption}
                    loadOptions={loadDepartmentOptions}
                    onChange={(option) => {
                        setDepartmentOption(option);
                        setFieldValue("departmentId", option?.value || "");
                    }}
                    error={errors.departmentId}
                    touched={touched.departmentId}
                    required
                />
            </div>
            <div className={`grid grid-cols-1 gap-4 ${mode === 'edit' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                <Select
                    id="designation"
                    name="designation"
                    label="Designation"
                    options={designationOptions}
                    value={values.designation}
                    onChange={(value) => setFieldValue("designation", value)}
                    error={errors.designation}
                    touched={touched.designation}
                    required
                />
                <Select
                    id="employmentType"
                    name="employmentType"
                    label="Employment Type"
                    options={employmentTypeOptions}
                    value={values.employmentType}
                    onChange={(value) => setFieldValue("employmentType", value)}
                    error={errors.employmentType}
                    touched={touched.employmentType}
                    required
                />
                {mode === 'edit' && (
                    <InputField
                        id="totalExperienceYears"
                        name="totalExperienceYears"
                        type="number"
                        label="Total Experience (years)"
                        value={values.totalExperienceYears}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.totalExperienceYears}
                        touched={touched.totalExperienceYears}
                    />
                )}
            </div>
            {mode === 'edit' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        id="highestQualification"
                        name="highestQualification"
                        label="Highest Qualification"
                        options={highestQualificationOptions}
                        value={values.highestQualification}
                        onChange={(value) => setFieldValue("highestQualification", value)}
                        error={errors.highestQualification}
                        touched={touched.highestQualification}
                    />
                    <InputField
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        placeholder="Optional"
                        value={values.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.remarks}
                        touched={touched.remarks}
                    />
                </div>
            )}
        </div>
    );
};

export default FacultyEmploymentFields;
