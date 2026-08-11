import { useMemo, useState } from "react";
import Select from "../../../../common/ui/Select";
import AsyncSelect, { type AsyncSelectOption } from "../../../../common/ui/AsyncSelect";
import { useAppDispatch } from "../../../../app/store/hooks";
import { createPaginatedLoadOptions } from "../../../../utils/asyncSelectHelpers";
import { academicsApiService } from "../../../../state/services/endpoints/academics";
import { subjectsApiService } from "../../../../state/services/endpoints/subjects";
import type { BatchData, CourseData, DepartmentData } from "../../../../types/academics-types";
import type { SubjectData } from "../../../../types/subjects-types";

interface ExamHierarchyFieldsProps {
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
    // Display names for the exam's current hierarchy selections — only
    // available in edit mode, since the exam already has ids but this
    // component otherwise has no way to know their labels until re-selected
    initialNames?: {
        batchName?: string;
        courseName?: string;
        departmentName?: string;
        sectionName?: string;
        subjectName?: string;
    };
}

const toOption = (value: string, label?: string): AsyncSelectOption | null =>
    value && label ? { value, label } : null;

const ExamHierarchyFields = ({ values, errors, touched, setFieldValue, disabled, initialNames }: ExamHierarchyFieldsProps) => {
    const dispatch = useAppDispatch();

    const [batchOption, setBatchOption] = useState<AsyncSelectOption | null>(
        () => toOption(values.batchId, initialNames?.batchName),
    );
    const [courseOption, setCourseOption] = useState<AsyncSelectOption | null>(
        () => toOption(values.courseId, initialNames?.courseName),
    );
    const [departmentOption, setDepartmentOption] = useState<AsyncSelectOption | null>(
        () => toOption(values.departmentId, initialNames?.departmentName),
    );
    const [subjectOption, setSubjectOption] = useState<AsyncSelectOption | null>(
        () => toOption(values.subjectId, initialNames?.subjectName),
    );

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

    const loadSubjectOptions = useMemo(() => createPaginatedLoadOptions<SubjectData, any>({
        dispatch,
        initiate: subjectsApiService.endpoints.getAllSubjectsAdmin.initiate,
        extraParams: { departmentId: values.departmentId, semester: Number(values.semester) },
        mapItem: (s) => ({ value: s._id, label: `${s.subjectCode} - ${s.subjectName}`, raw: s }),
        supportsSearch: false,
    }), [dispatch, values.departmentId, values.semester]);

    // Sections come nested in the selected department's own record, not a
    // separate paginated endpoint — a plain Select, but with the currently
    // selected section injected synthetically so it still displays correctly
    // in edit mode before the department has been actively re-selected.
    const sectionsFromDept: { _id: string; sectionName: string }[] = departmentOption?.raw?.sections || [];
    const sectionOptions = (
        !values.sectionId || sectionsFromDept.some((s) => s._id === values.sectionId)
            ? sectionsFromDept
            : [{ _id: values.sectionId, sectionName: initialNames?.sectionName || "Current Section" }, ...sectionsFromDept]
    ).map((s) => ({ value: s._id, label: s.sectionName }));

    const courseSemesters: number = courseOption?.raw?.semesters || 0;
    const semesterOptions = Array.from({ length: courseSemesters }, (_, i) => ({ value: i + 1, label: `Semester ${i + 1}` }));
    const semesterValue = Number(values.semester);
    if (semesterValue && !semesterOptions.some((o) => o.value === semesterValue)) {
        semesterOptions.unshift({ value: semesterValue, label: `Semester ${semesterValue}` });
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AsyncSelect
                    id="batchId"
                    label="Batch"
                    value={batchOption}
                    loadOptions={loadBatchOptions}
                    disabled={disabled}
                    onChange={(option) => {
                        setBatchOption(option);
                        setFieldValue("batchId", option?.value || "");
                        setCourseOption(null);
                        setDepartmentOption(null);
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
                <AsyncSelect
                    key={values.batchId}
                    id="courseId"
                    label="Course"
                    value={courseOption}
                    loadOptions={loadCourseOptions}
                    disabled={disabled || !values.batchId}
                    onChange={(option) => {
                        setCourseOption(option);
                        setFieldValue("courseId", option?.value || "");
                        setDepartmentOption(null);
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
                <AsyncSelect
                    key={courseOption?.raw?.batchCourseId || values.courseId}
                    id="departmentId"
                    label="Department"
                    value={departmentOption}
                    loadOptions={loadDepartmentOptions}
                    disabled={disabled || !values.courseId}
                    onChange={(option) => {
                        setDepartmentOption(option);
                        setFieldValue("departmentId", option?.value || "");
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
                <AsyncSelect
                    key={`${values.departmentId}-${values.semester}`}
                    id="subjectId"
                    label="Subject"
                    value={subjectOption}
                    loadOptions={loadSubjectOptions}
                    disabled={disabled || !values.departmentId || !values.semester}
                    onChange={(option) => {
                        setSubjectOption(option);
                        setFieldValue("subjectId", option?.value || "");
                    }}
                    error={errors.subjectId}
                    touched={touched.subjectId}
                    required
                />
            </div>
        </div>
    );
};

export default ExamHierarchyFields;
