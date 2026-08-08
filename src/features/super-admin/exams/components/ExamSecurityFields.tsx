import InputField from "../../../../common/ui/Input";

interface ExamSecurityFieldsProps {
    values: any;
    setFieldValue: (field: string, value: any) => void;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    disabled?: boolean;
}

const Checkbox = ({ id, label, checked, onChange, disabled }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
        <input
            id={id}
            type="checkbox"
            checked={!!checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-borderLight"
        />
        {label}
    </label>
);

const ExamSecurityFields = ({ values, setFieldValue, handleChange, handleBlur, disabled }: ExamSecurityFieldsProps) => {
    const settings = values.securitySettings || {};

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Checkbox
                    id="shuffleQuestions"
                    label="Shuffle Question Order"
                    checked={settings.shuffleQuestions}
                    onChange={(checked) => setFieldValue("securitySettings.shuffleQuestions", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="shuffleOptions"
                    label="Shuffle Options (MCQ/MSQ)"
                    checked={settings.shuffleOptions}
                    onChange={(checked) => setFieldValue("securitySettings.shuffleOptions", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="disableCopyPaste"
                    label="Disable Copy/Paste"
                    checked={settings.disableCopyPaste}
                    onChange={(checked) => setFieldValue("securitySettings.disableCopyPaste", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="disableRightClick"
                    label="Disable Right-Click"
                    checked={settings.disableRightClick}
                    onChange={(checked) => setFieldValue("securitySettings.disableRightClick", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="requireFullScreenThroughout"
                    label="Require Full-Screen Throughout"
                    checked={settings.requireFullScreenThroughout}
                    onChange={(checked) => setFieldValue("securitySettings.requireFullScreenThroughout", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="blockBackwardNavigation"
                    label="Block Backward Navigation"
                    checked={settings.blockBackwardNavigation}
                    onChange={(checked) => setFieldValue("securitySettings.blockBackwardNavigation", checked)}
                    disabled={disabled}
                />
                <Checkbox
                    id="faceDetectionEnabled"
                    label="Face Detection (advanced, not yet enforced)"
                    checked={settings.faceDetectionEnabled}
                    onChange={(checked) => setFieldValue("securitySettings.faceDetectionEnabled", checked)}
                    disabled={disabled}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id="securitySettings.tabSwitchViolationThreshold"
                    name="securitySettings.tabSwitchViolationThreshold"
                    type="number"
                    label="Tab-Switch Violation Threshold"
                    value={settings.tabSwitchViolationThreshold}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
                <InputField
                    id="securitySettings.fullScreenExitViolationThreshold"
                    name="securitySettings.fullScreenExitViolationThreshold"
                    type="number"
                    label="Full-Screen-Exit Violation Threshold"
                    value={settings.fullScreenExitViolationThreshold}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
                <InputField
                    id="securitySettings.connectionLossGracePeriodMinutes"
                    name="securitySettings.connectionLossGracePeriodMinutes"
                    type="number"
                    label="Connection-Loss Grace Period (minutes)"
                    value={settings.connectionLossGracePeriodMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
                <InputField
                    id="securitySettings.cameraMicLossGracePeriodMinutes"
                    name="securitySettings.cameraMicLossGracePeriodMinutes"
                    type="number"
                    label="Camera/Mic Loss Grace Period (minutes)"
                    value={settings.cameraMicLossGracePeriodMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default ExamSecurityFields;
