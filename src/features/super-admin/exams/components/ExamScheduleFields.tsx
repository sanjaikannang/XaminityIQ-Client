import InputField from "../../../../common/ui/Input";
import { ExamMode } from "../../../../utils/enum";

interface ExamScheduleFieldsProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    disabled?: boolean;
}

const ExamScheduleFields = ({ values, errors, touched, handleChange, handleBlur, disabled }: ExamScheduleFieldsProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    id="durationMinutes"
                    name="durationMinutes"
                    type="number"
                    label="Duration (minutes)"
                    placeholder="e.g., 60"
                    value={values.durationMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.durationMinutes}
                    touched={touched.durationMinutes}
                    required
                    disabled={disabled}
                />
                <InputField
                    id="totalMarks"
                    name="totalMarks"
                    type="number"
                    label="Total Marks"
                    placeholder="e.g., 50"
                    value={values.totalMarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.totalMarks}
                    touched={touched.totalMarks}
                    required
                    disabled={disabled}
                />
                <InputField
                    id="passingMarks"
                    name="passingMarks"
                    type="number"
                    label="Passing Marks"
                    placeholder="e.g., 20"
                    value={values.passingMarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.passingMarks}
                    touched={touched.passingMarks}
                    required
                    disabled={disabled}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="startDate"
                    name="startDate"
                    type="date"
                    label="Start Date"
                    value={values.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.startDate}
                    touched={touched.startDate}
                    required
                    disabled={disabled}
                />
                <InputField
                    id="endDate"
                    name="endDate"
                    type="date"
                    label="End Date"
                    value={values.endDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.endDate}
                    touched={touched.endDate}
                    required
                    disabled={disabled}
                />
            </div>
            {values.mode === ExamMode.PROCTORING && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="startTime"
                        name="startTime"
                        type="time"
                        label="Start Time (IST)"
                        value={values.startTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.startTime}
                        touched={touched.startTime}
                        required
                        disabled={disabled}
                    />
                    <InputField
                        id="endTime"
                        name="endTime"
                        type="time"
                        label="End Time (IST)"
                        value={values.endTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.endTime}
                        touched={touched.endTime}
                        required
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    );
};

export default ExamScheduleFields;
