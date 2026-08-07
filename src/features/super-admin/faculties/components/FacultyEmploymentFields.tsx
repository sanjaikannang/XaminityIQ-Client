import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import { FacultyDesignation, EmploymentType, HighestQualification } from "../../../../utils/enum";
import { useGetAllDepartmentsQuery } from "../../../../state/services/endpoints/academics";

interface FacultyEmploymentFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const designationOptions = Object.values(FacultyDesignation).map((value) => ({ value, label: value }));
const employmentTypeOptions = Object.values(EmploymentType).map((value) => ({ value, label: value }));
const highestQualificationOptions = Object.values(HighestQualification).map((value) => ({ value, label: value }));

const FacultyEmploymentFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: FacultyEmploymentFieldsProps) => {
    const { data: departmentsData, isFetching: isDepartmentsLoading } = useGetAllDepartmentsQuery();
    const departmentOptions = (departmentsData?.data || []).map((d) => ({ value: d._id, label: d.deptName }));

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
                <Select
                    id="departmentId"
                    name="departmentId"
                    label="Department"
                    options={departmentOptions}
                    value={values.departmentId}
                    loading={isDepartmentsLoading}
                    onChange={(value) => setFieldValue("departmentId", value)}
                    error={errors.departmentId}
                    touched={touched.departmentId}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    required
                />
            </div>
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
                    required
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
        </div>
    );
};

export default FacultyEmploymentFields;
