import Select from "../../../../common/ui/Select";
import { useGetBatchesQuery, useGetCoursesQuery, useGetDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import { useGetAllSubjectsAdminQuery } from "../../../../state/services/endpoints/subjects";

interface ExamHierarchyFieldsProps {
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}

const ExamHierarchyFields = ({ values, errors, touched, setFieldValue, disabled }: ExamHierarchyFieldsProps) => {
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

    const { data: subjectsData, isFetching: isSubjectsLoading } = useGetAllSubjectsAdminQuery(
        { departmentId: values.departmentId, semester: Number(values.semester), limit: 100 },
        { skip: !values.departmentId || !values.semester }
    );

    const batchOptions = (batchesData?.data || []).map((b) => ({ value: b._id, label: b.batchName }));
    const courseOptions = (coursesData?.data || []).map((c) => ({ value: c._id, label: c.courseName }));
    const departmentOptions = (departmentsData?.data || []).map((d) => ({ value: d._id, label: d.deptName }));
    const sectionOptions = sections.map((s) => ({ value: s._id, label: s.sectionName }));
    const semesterOptions = Array.from({ length: selectedCourse?.semesters || 0 }, (_, i) => ({
        value: i + 1,
        label: `Semester ${i + 1}`,
    }));
    const subjectOptions = (subjectsData?.data || []).map((s) => ({ value: s._id, label: `${s.subjectCode} - ${s.subjectName}` }));

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
                    disabled={disabled}
                    onChange={(value) => {
                        setFieldValue("batchId", value);
                        setFieldValue("courseId", "");
                        setFieldValue("departmentId", "");
                        setFieldValue("sectionId", "");
                        setFieldValue("semester", "");
                        setFieldValue("subjectId", "");
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
                    disabled={disabled || !values.batchId}
                    onChange={(value) => {
                        setFieldValue("courseId", value);
                        setFieldValue("departmentId", "");
                        setFieldValue("sectionId", "");
                        setFieldValue("semester", "");
                        setFieldValue("subjectId", "");
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
                    disabled={disabled || !values.courseId}
                    onChange={(value) => {
                        setFieldValue("departmentId", value);
                        setFieldValue("sectionId", "");
                        setFieldValue("subjectId", "");
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
                    disabled={disabled || !values.departmentId}
                    onChange={(value) => setFieldValue("sectionId", value)}
                    error={errors.sectionId}
                    touched={touched.sectionId}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    id="semester"
                    name="semester"
                    label="Semester"
                    options={semesterOptions}
                    value={values.semester}
                    disabled={disabled || !values.courseId}
                    onChange={(value) => {
                        setFieldValue("semester", value);
                        setFieldValue("subjectId", "");
                    }}
                    error={errors.semester}
                    touched={touched.semester}
                    required
                />
                <Select
                    id="subjectId"
                    name="subjectId"
                    label="Subject"
                    options={subjectOptions}
                    value={values.subjectId}
                    loading={isSubjectsLoading}
                    disabled={disabled || !values.departmentId || !values.semester}
                    onChange={(value) => setFieldValue("subjectId", value)}
                    error={errors.subjectId}
                    touched={touched.subjectId}
                    required
                />
            </div>
        </div>
    );
};

export default ExamHierarchyFields;
