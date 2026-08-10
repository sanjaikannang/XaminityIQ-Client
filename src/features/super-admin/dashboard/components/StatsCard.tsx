import type { LucideIcon } from "lucide-react";

export type StatsCardVariant = "primary" | "success" | "warning" | "danger" | "purple" | "indigo";

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    variant?: StatsCardVariant;
    subtitle?: string;
}

const variantStyles: Record<StatsCardVariant, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
};

const StatsCard = ({ title, value, icon: Icon, variant = "primary", subtitle }: StatsCardProps) => {
    return (
        <div className="bg-whiteColor rounded-xl border border-borderDefault p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-textSecondary truncate">{title}</p>
                    <h3 className="text-2xl font-bold text-textPrimary mt-1">
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </h3>
                    {subtitle && <p className="text-xs text-textTertiary mt-1">{subtitle}</p>}
                </div>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${variantStyles[variant]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
