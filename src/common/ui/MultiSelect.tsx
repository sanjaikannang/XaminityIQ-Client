import ReactSelect, { type StylesConfig } from "react-select";

export interface MultiSelectOption {
    value: string | number;
    label: string;
}

interface MultiSelectProps {
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    touched?: boolean;
    className?: string;

    options: MultiSelectOption[];
    value: (string | number)[];
    onChange: (values: (string | number)[]) => void;
}

const customStyles: StylesConfig<MultiSelectOption, true> = {
    control: (base, state) => ({
        ...base,
        minHeight: "42px",
        borderRadius: "0.5rem",
        borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-borderLight)",
        boxShadow: "none",
        backgroundColor: state.isDisabled ? "var(--color-bgTertiary)" : "var(--color-bgPrimary)",
        cursor: "pointer",
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 12px" }),
    placeholder: (base) => ({ ...base, color: "var(--color-textSecondary)" }),
    multiValue: (base) => ({ ...base, backgroundColor: "var(--color-bgSecondary)" }),
    multiValueLabel: (base) => ({ ...base, color: "var(--color-textPrimary)" }),
    input: (base) => ({ ...base, color: "var(--color-textPrimary)" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-bgPrimary)",
        border: "1px solid var(--color-borderLight)",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "var(--color-primary)"
            : state.isFocused
                ? "var(--color-bgSecondary)"
                : "transparent",
        color: state.isSelected ? "#fff" : "var(--color-textPrimary)",
        cursor: "pointer",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "var(--color-textSecondary)" }),
    noOptionsMessage: (base) => ({ ...base, color: "var(--color-textSecondary)" }),
};

// Multi-select dropdown for a static, already-loaded options list (unlike
// AsyncSelect, which fetches from a paginated API). Used where a field now
// accepts more than one value — e.g. an exam's target sections/semesters.
const MultiSelect = ({
    id,
    label,
    placeholder = "Select options",
    required = false,
    disabled = false,
    error,
    touched,
    className = "",
    options,
    value,
    onChange,
}: MultiSelectProps) => {
    const hasError = !!error && !!touched;
    const selectedOptions = options.filter((o) => value.includes(o.value));

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-2" style={{ color: "var(--color-textSecondary)" }}>
                    {label}
                    {required && <span className="ml-1" style={{ color: "var(--color-error)" }}>*</span>}
                </label>
            )}

            <ReactSelect
                inputId={id}
                isMulti
                value={selectedOptions}
                onChange={(selected) => onChange((selected as MultiSelectOption[]).map((o) => o.value))}
                options={options}
                isDisabled={disabled}
                placeholder={placeholder}
                styles={{
                    ...customStyles,
                    control: (base, state) => ({
                        ...(customStyles.control?.(base, state) ?? base),
                        borderColor: hasError ? "var(--color-error)" : state.isFocused ? "var(--color-primary)" : "var(--color-borderLight)",
                    }),
                }}
                menuPortalTarget={document.body}
                menuPlacement="auto"
            />

            {hasError && (
                <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default MultiSelect;
