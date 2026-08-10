export type ChipVariant = "green" | "red" | "yellow" | "blue" | "gray" | "purple" | "orange" | "indigo";

interface ChipProps {
    label: string;
    variant?: ChipVariant;
}

const variantStyles: Record<ChipVariant, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    indigo: "bg-indigo-100 text-indigo-700",
};

const Chip = ({ label, variant = "gray" }: ChipProps) => (
    <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${variantStyles[variant]}`}
    >
        {label}
    </span>
);

export default Chip;
