import type { GroupBase, StylesConfig } from "react-select";
import { AsyncPaginate, type LoadOptions } from "react-select-async-paginate";

export interface AsyncSelectOption {
    value: string;
    label: string;
    // Original API record, carried along for callers that need more than
    // value/label (e.g. a course's batchCourseId, used to cascade into the
    // department fetch)
    raw?: any;
}

type Additional = { page: number };

interface AsyncSelectProps {
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    touched?: boolean;
    className?: string;

    value: AsyncSelectOption | null;
    onChange: (option: AsyncSelectOption | null) => void;
    loadOptions: LoadOptions<AsyncSelectOption, GroupBase<AsyncSelectOption>, Additional>;
}

const customStyles: StylesConfig<AsyncSelectOption, false> = {
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
    singleValue: (base) => ({ ...base, color: "var(--color-textPrimary)" }),
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
    loadingMessage: (base) => ({ ...base, color: "var(--color-textSecondary)" }),
    noOptionsMessage: (base) => ({ ...base, color: "var(--color-textSecondary)" }),
};

// Searchable, infinite-scrolling select for options fetched from an API.
// Wraps react-select-async-paginate — the caller supplies `loadOptions`,
// built via createPaginatedLoadOptions/createFlatLoadOptions below.
const AsyncSelect = ({
    id,
    label,
    placeholder = "Select an option",
    required = false,
    disabled = false,
    error,
    touched,
    className = "",
    value,
    onChange,
    loadOptions,
}: AsyncSelectProps) => {
    const hasError = !!error && !!touched;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-2" style={{ color: "var(--color-textSecondary)" }}>
                    {label}
                    {required && <span className="ml-1" style={{ color: "var(--color-error)" }}>*</span>}
                </label>
            )}

            <AsyncPaginate
                inputId={id}
                value={value}
                onChange={(option) => onChange(option as AsyncSelectOption | null)}
                loadOptions={loadOptions}
                additional={{ page: 1 }}
                debounceTimeout={350}
                isDisabled={disabled}
                isClearable
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

export default AsyncSelect;
