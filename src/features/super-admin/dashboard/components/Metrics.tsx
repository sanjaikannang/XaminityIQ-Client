import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Mock Data
const mockData = {
    students: {
        total: 1250,
        active: 1100,
        alumni: 850,
        suspended: 15,
        newAdmissions: 45,
        trend: 8.5,
    },
    faculty: {
        total: 85,
        active: 82,
        trend: 2.4,
    },
    academic: {
        totalBatches: 24,
        totalCourses: 156,
        totalDepartments: 8,
        totalSections: 48,
    },
    exams: {
        completed: 342,
        ongoing: 12,
        upcoming: 28,
    },
    users: {
        total: 1385,
        active: 1205,
        firstTimeLogin: 35,
        passwordReset: 18,
    },
    monthlyAdmissions: [
        { month: "Jan", count: 32 },
        { month: "Feb", count: 28 },
        { month: "Mar", count: 45 },
        { month: "Apr", count: 52 },
        { month: "May", count: 38 },
        { month: "Jun", count: 65 },
        { month: "Jul", count: 78 },
        { month: "Aug", count: 92 },
        { month: "Sep", count: 45 },
    ],
    departmentDistribution: [
        { name: "Computer Science", value: 320 },
        { name: "Engineering", value: 280 },
        { name: "Business", value: 210 },
        { name: "Arts", value: 150 },
        { name: "Science", value: 180 },
        { name: "Medicine", value: 110 },
    ],
};


const Metrics: React.FC = () => {
    const admissionTrendRef = useRef<HTMLDivElement>(null);
    const studentStatusRef = useRef<HTMLDivElement>(null);
    const departmentDistRef = useRef<HTMLDivElement>(null);
    const examTimelineRef = useRef<HTMLDivElement>(null);
    const userActivityRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Admission Trend Chart
        if (admissionTrendRef.current) {
            const chart = echarts.init(admissionTrendRef.current);
            chart.setOption({
                tooltip: { trigger: "axis" },
                grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
                xAxis: {
                    type: "category",
                    data: mockData.monthlyAdmissions.map((d) => d.month),
                    boundaryGap: false,
                },
                yAxis: { type: "value" },
                series: [
                    {
                        name: "New Admissions",
                        type: "line",
                        smooth: true,
                        areaStyle: { color: "rgba(59, 130, 246, 0.1)" },
                        lineStyle: { color: "#3b82f6", width: 3 },
                        itemStyle: { color: "#3b82f6" },
                        data: mockData.monthlyAdmissions.map((d) => d.count),
                    },
                ],
            });
            window.addEventListener("resize", () => chart.resize());
        }

        // Student Status Pie Chart
        if (studentStatusRef.current) {
            const chart = echarts.init(studentStatusRef.current);
            chart.setOption({
                tooltip: { trigger: "item" },
                legend: { bottom: "5%", left: "center" },
                series: [
                    {
                        name: "Student Status",
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
                        label: { show: false, position: "center" },
                        emphasis: {
                            label: { show: true, fontSize: 20, fontWeight: "bold" },
                        },
                        data: [
                            {
                                value: mockData.students.active,
                                name: "Active",
                                itemStyle: { color: "#10b981" },
                            },
                            {
                                value: mockData.students.alumni,
                                name: "Alumni",
                                itemStyle: { color: "#3b82f6" },
                            },
                            {
                                value: mockData.students.suspended,
                                name: "Suspended",
                                itemStyle: { color: "#ef4444" },
                            },
                        ],
                    },
                ],
            });
            window.addEventListener("resize", () => chart.resize());
        }

        // Department Distribution Bar Chart
        if (departmentDistRef.current) {
            const chart = echarts.init(departmentDistRef.current);
            chart.setOption({
                tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
                xAxis: { type: "value" },
                yAxis: {
                    type: "category",
                    data: mockData.departmentDistribution.map((d) => d.name),
                },
                series: [
                    {
                        name: "Students",
                        type: "bar",
                        data: mockData.departmentDistribution.map((d) => d.value),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: "#3b82f6" },
                                { offset: 1, color: "#8b5cf6" },
                            ]),
                        },
                    },
                ],
            });
            window.addEventListener("resize", () => chart.resize());
        }

        // Exam Timeline Bar Chart
        if (examTimelineRef.current) {
            const chart = echarts.init(examTimelineRef.current);
            chart.setOption({
                tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
                xAxis: {
                    type: "category",
                    data: ["Completed", "Ongoing", "Upcoming"],
                },
                yAxis: { type: "value" },
                series: [
                    {
                        name: "Exams",
                        type: "bar",
                        data: [
                            { value: mockData.exams.completed, itemStyle: { color: "#10b981" } },
                            { value: mockData.exams.ongoing, itemStyle: { color: "#f59e0b" } },
                            { value: mockData.exams.upcoming, itemStyle: { color: "#3b82f6" } },
                        ],
                        barWidth: "60%",
                    },
                ],
            });
            window.addEventListener("resize", () => chart.resize());
        }

        // User Activity Stacked Bar
        if (userActivityRef.current) {
            const chart = echarts.init(userActivityRef.current);
            chart.setOption({
                tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                legend: { data: ["Active", "First Login Pending", "Password Reset"] },
                grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
                xAxis: { type: "value" },
                yAxis: { type: "category", data: ["Users"] },
                series: [
                    {
                        name: "Active",
                        type: "bar",
                        stack: "total",
                        data: [mockData.users.active],
                        itemStyle: { color: "#10b981" },
                    },
                    {
                        name: "First Login Pending",
                        type: "bar",
                        stack: "total",
                        data: [mockData.users.firstTimeLogin],
                        itemStyle: { color: "#f59e0b" },
                    },
                    {
                        name: "Password Reset",
                        type: "bar",
                        stack: "total",
                        data: [mockData.users.passwordReset],
                        itemStyle: { color: "#ef4444" },
                    },
                ],
            });
            window.addEventListener("resize", () => chart.resize());
        }
    }, []);

    return (
        <>
            <div className="py-4">
                {/* Charts Row 1 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Monthly Admission Trends
                        </h3>
                        <div ref={admissionTrendRef} className="h-64"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Student Status Distribution
                        </h3>
                        <div ref={studentStatusRef} className="h-64"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Students by Department
                        </h3>
                        <div ref={departmentDistRef} className="h-64"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Exam Status Overview
                        </h3>
                        <div ref={examTimelineRef} className="h-64"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            User Activity Status
                        </h3>
                        <div ref={userActivityRef} className="h-64"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Metrics;