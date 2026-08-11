import { useMemo, useState } from "react";
import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import AsyncSelect, { type AsyncSelectOption } from "../../../../common/ui/AsyncSelect";
import { AdmissionType } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";
import { useAppDispatch } from "../../../../app/store/hooks";
import { createPaginatedLoadOptions } from "../../../../utils/asyncSelectHelpers";
import { academicsApiService } from "../../../../state/services/endpoints/academics";
import type { BatchData, CourseData, DepartmentData } from "../../../../types/academics-types";

interface StudentAcademicFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
}

const admissionTypeOptions = toEnumOptions(AdmissionType);

const StudentAcademicFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue }: StudentAcademicFieldsProps) => {
    const dispatch = useAppDispatch();

    // This form only ever creates new students (editing a student omits
    // academic fields entirely), so every selection here starts empty —
    // no need to seed initial labels for an existing value.
    const [batchOption, setBatchOption] = useState<AsyncSelectOption | null>(null);
    const [courseOption, setCourseOption] = useState<AsyncSelectOption | null>(null);
    const [departmentOption, setDepartmentOption] = useState<AsyncSelectOption | null>(null);

    const loadBatchOptions = useMemo(() => createPaginatedLoadOptions<BatchData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getBatches.initiate,
        extraParams: {},
        mapItem: (b) => ({ value: b._id, label: b.batchName, raw: b }),
    }), [dispatch]);

    const loadCourseOptions = useMemo(() => createPaginatedLoadOptions<CourseData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getCourses.initiate,
        extraParams: { batchId: values.batchId },
        mapItem: (c) => ({ value: c._id, label: c.courseName, raw: c }),
    }), [dispatch, values.batchId]);

    const loadDepartmentOptions = useMemo(() => createPaginatedLoadOptions<DepartmentData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getDepartments.initiate,
        extraParams: { batchCourseId: courseOption?.raw?.batchCourseId },
        mapItem: (d) => ({ value: d._id, label: d.deptName, raw: d }),
    }), [dispatch, courseOption?.raw?.batchCourseId]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AsyncSelect
                    id="batchId"
                    label="Batch"
                    value={batchOption}
                    loadOptions={loadBatchOptions}
                    onChange={(option) => {
                        setBatchOption(option);
                        setFieldValue("batchId", option?.value || "");
                        setCourseOption(null);
                        setDepartmentOption(null);
                        setFieldValue("courseId", "");
                        setFieldValue("departmentId", "");
                    }}
                    error={errors.batchId}
                    touched={touched.batchId}
                    required
                />
                <AsyncSelect
                    key={values.batchId}
                    id="courseId"
                    label="Course"
                    value={courseOption}
                    loadOptions={loadCourseOptions}
                    disabled={!values.batchId}
                    onChange={(option) => {
                        setCourseOption(option);
                        setFieldValue("courseId", option?.value || "");
                        setDepartmentOption(null);
                        setFieldValue("departmentId", "");
                    }}
                    error={errors.courseId}
                    touched={touched.courseId}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AsyncSelect
                    key={courseOption?.raw?.batchCourseId || values.courseId}
                    id="departmentId"
                    label="Department"
                    value={departmentOption}
                    loadOptions={loadDepartmentOptions}
                    disabled={!values.courseId}
                    onChange={(option) => {
                        setDepartmentOption(option);
                        setFieldValue("departmentId", option?.value || "");
                    }}
                    error={errors.departmentId}
                    touched={touched.departmentId}
                    required
                />
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
