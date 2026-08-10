import type { EChartsOption } from "echarts";
import { Chart } from "../../../../common/ui/Chart";
import { formatEnumLabel } from "../../../../utils/utils";
import { AXIS_TEXT_STYLE, CHART_COLORS, CHART_PALETTE, GRID_LINE_COLOR } from "../../../../utils/chartTheme";
import type { DashboardOverviewData } from "../../../../types/dashboard-types";

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
        <h2 className="text-lg font-bold text-textPrimary mb-4">{title}</h2>
        {children}
    </section>
);

const donutOption = (data: { status: string; count: number }[]): EChartsOption => ({
    tooltip: { trigger: "item" },
    legend: { bottom: 0, textStyle: AXIS_TEXT_STYLE },
    color: CHART_PALETTE,
    series: [
        {
            type: "pie",
            radius: ["45%", "70%"],
            avoidLabelOverlap: true,
            itemStyle: { borderColor: "#fff", borderWidth: 2 },
            label: { show: false },
            emphasis: { label: { show: true, fontWeight: "bold" } },
            data: data
                .filter((d) => d.count > 0)
                .map((d) => ({ name: formatEnumLabel(d.status), value: d.count })),
        },
    ],
});

const barOption = (data: { status: string; count: number }[]): EChartsOption => ({
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 16, top: 20, bottom: 30 },
    xAxis: {
        type: "category",
        data: data.map((d) => formatEnumLabel(d.status)),
        axisLine: { lineStyle: { color: GRID_LINE_COLOR } },
        axisLabel: AXIS_TEXT_STYLE,
    },
    yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: GRID_LINE_COLOR } },
        axisLabel: AXIS_TEXT_STYLE,
    },
    series: [
        {
            type: "bar",
            data: data.map((d) => d.count),
            itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] },
            barWidth: "50%",
        },
    ],
});

const TOP_DEPARTMENTS_SHOWN = 8;

const departmentGroupedBarOption = (allData: DashboardOverviewData["departmentDistribution"]): EChartsOption => {
    const data = [...allData]
        .sort((a, b) => (b.studentCount + b.facultyCount) - (a.studentCount + a.facultyCount))
        .slice(0, TOP_DEPARTMENTS_SHOWN);

    return {
        tooltip: { trigger: "axis" },
        legend: { top: 0, textStyle: AXIS_TEXT_STYLE },
        grid: { left: 40, right: 16, top: 40, bottom: 50 },
        xAxis: {
            type: "category",
            data: data.map((d) => d.departmentName),
            axisLine: { lineStyle: { color: GRID_LINE_COLOR } },
            axisLabel: { ...AXIS_TEXT_STYLE, rotate: data.length > 5 ? 25 : 0 },
        },
        yAxis: {
            type: "value",
            splitLine: { lineStyle: { color: GRID_LINE_COLOR } },
            axisLabel: AXIS_TEXT_STYLE,
        },
        series: [
            {
                name: "Students",
                type: "bar",
                data: data.map((d) => d.studentCount),
                itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] },
            },
            {
                name: "Faculty",
                type: "bar",
                data: data.map((d) => d.facultyCount),
                itemStyle: { color: CHART_COLORS.purple, borderRadius: [4, 4, 0, 0] },
            },
        ],
    };
};

interface DashboardChartsProps {
    data: DashboardOverviewData;
}

const DashboardCharts = ({ data }: DashboardChartsProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Exam Status Distribution">
                <Chart option={donutOption(data.examsByStatus)} height="280px" />
            </ChartCard>
            <ChartCard title="Exam Mode Distribution">
                <Chart option={donutOption(data.examsByMode)} height="280px" />
            </ChartCard>
            <ChartCard title="Attempt Status Breakdown">
                <Chart option={barOption(data.attemptsByStatus)} height="280px" />
            </ChartCard>
            <ChartCard title="Students & Faculty by Department">
                <Chart option={departmentGroupedBarOption(data.departmentDistribution)} height="280px" />
            </ChartCard>
        </div>
    );
};

export default DashboardCharts;
