"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MiniAreaChartProps<T extends Record<string, unknown>> = {
  data: T[];
  dataKey: keyof T;
  xKey: keyof T;
  gradientId?: string;
  color?: string;
  height?: number;
  yAxisWidth?: number;
};

export function MiniAreaChart<T extends Record<string, unknown>>({
  data,
  dataKey,
  xKey,
  gradientId = "miniAreaGradient",
  color = "#0A84FF",
  height = 200,
  yAxisWidth = 0,
}: MiniAreaChartProps<T>): React.ReactElement {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.52} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 8" vertical={false} stroke="#dfe2eb" />
        <XAxis
          dataKey={xKey as string}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          dy={10}
          tick={{ fill: "#475569", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={yAxisWidth}
          tick={{ fill: "#475569", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15, 23, 42, 0.92)",
            borderRadius: 16,
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "white",
          }}
        />
        <Area
          type="natural"
          dataKey={dataKey as string}
          stroke={color}
          strokeWidth={2.6}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

