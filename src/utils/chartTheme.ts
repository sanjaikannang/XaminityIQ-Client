// Chart colors mirror the app's theme tokens (src/global.css) and Chip.tsx
// variants, so ECharts output reads as part of the same design system.
export const CHART_COLORS = {
    primary: "#029de3",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#dc2626",
    purple: "#9333ea",
    indigo: "#6366f1",
    orange: "#f97316",
    gray: "#9ca3af",
};

export const CHART_PALETTE = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.purple,
    CHART_COLORS.orange,
    CHART_COLORS.indigo,
    CHART_COLORS.danger,
    CHART_COLORS.gray,
];

export const AXIS_TEXT_STYLE = { color: "#6b7280", fontFamily: "Arimo" };
export const GRID_LINE_COLOR = "#e5e7eb";
