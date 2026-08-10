import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartProps {
    option: echarts.EChartsOption;
    height?: string;
}

// Thin echarts wrapper: owns the instance's lifecycle so callers only pass an
// option object. Handles init/dispose and window-resize cleanup, which a raw
// echarts.init() call inside a component easily leaks on unmount.
export function Chart({ option, height = "300px" }: ChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const chart = echarts.init(containerRef.current);
        chartRef.current = chart;

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.dispose();
            chartRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        chartRef.current?.setOption(option, true);
    }, [option]);

    return <div ref={containerRef} style={{ width: "100%", height }} />;
}
