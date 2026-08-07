import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import { AdmissionType } from "../../../../utils/enum";
import { useGetBatchesQuery, useGetCoursesQuery, useGetDepartmentsQuery } from "../../../../state/services/endpoints/academics";

interface StudentAcademicFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const admissionTypeOptions = Object.values(AdmissionType).map((value) => ({ value, label: value }));

const StudentAcademicFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: StudentAcademicFieldsProps) => {
    const { data: batchesData, isFetching: isBatchesLoading } = useGetBatchesQuery({ limit: 100 });
    const { data: coursesData, isFetching: isCoursesLoading } = useGetCoursesQuery(
        { batchId: values.batchId, limit: 100 },
        { skip: !values.batchId }
    );

    const selectedCourse = coursesData?.data?.find((c) => c._id === values.courseId);

    const { data: departmentsData, isFetching: isDepartmentsLoading } = useGetDepartmentsQuery(
        { batchCourseId: selectedCourse?.batchCourseId as string, limit: 100 },
        { skip: !selectedCourse?.batchCourseId }
    );

    const selectedDepartment = departmentsData?.data?.find((d) => d._id === values.departmentId);
    const sections = selectedDepartment?.sections || [];

    const batchOptions = (batchesData?.data || []).map((b) => ({ value: b._id, label: b.batchName }));
    const courseOptions = (coursesData?.data || []).map((c) => ({ value: c._id, label: c.courseName }));
    const departmentOptions = (departmentsData?.data || []).map((d) => ({ value: d._id, label: d.deptName }));
    const sectionOptions = sections.map((s) => ({ value: s._id, label: s.sectionName }));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    id="batchId"
                    name="batchId"
                    label="Batch"
                    options={batchOptions}
                    value={values.batchId}
                    loading={isBatchesLoading}
                    onChange={(value) => {
                        setFieldValue("batchId", value);
                        setFieldValue("courseId", "");
                        setFieldValue("departmentId", "");
                        setFieldValue("sectionId", "");
                    }}
                    error={errors.batchId}
                    touched={touched.batchId}
                    required
                />
                <Select
                    id="courseId"
                    name="courseId"
                    label="Course"
                    options={courseOptions}
                    value={values.courseId}
                    loading={isCoursesLoading}
                    disabled={!values.batchId}
                    onChange={(value) => {
                        setFieldValue("courseId", value);
                        setFieldValue("departmentId", "");
                        setFieldValue("sectionId", "");
                    }}
                    error={errors.courseId}
                    touched={touched.courseId}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    id="departmentId"
                    name="departmentId"
                    label="Department"
                    options={departmentOptions}
                    value={values.departmentId}
                    loading={isDepartmentsLoading}
                    disabled={!values.courseId}
                    onChange={(value) => {
                        setFieldValue("departmentId", value);
                        setFieldValue("sectionId", "");
                    }}
                    error={errors.departmentId}
                    touched={touched.departmentId}
                    required
                />
                <Select
                    id="sectionId"
                    name="sectionId"
                    label="Section"
                    options={sectionOptions}
                    value={values.sectionId}
                    disabled={!values.departmentId}
                    onChange={(value) => setFieldValue("sectionId", value)}
                    error={errors.sectionId}
                    touched={touched.sectionId}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="currentSemester"
                    name="currentSemester"
                    type="number"
                    label="Current Semester"
                    placeholder="1"
                    value={values.currentSemester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.currentSemester}
                    touched={touched.currentSemester}
                    required
                />
                <Select
                    id="admissionType"
                    name="admissionType"
                    label="Admission Type"
                    options={admissionTypeOptions}
                    value={values.admissionType}
                    onChange={(value) => setFieldValue("admissionType", value)}
                    error={errors.admissionType}
                    touched={touched.admissionType}
                    required
                />
            </div>
        </div>
    );
};

export default StudentAcademicFields;
