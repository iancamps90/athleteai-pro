"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Series = {
  dataKey: string;
  color: string;
  name: string;
};

type MultiLineChartProps<T extends Record<string, unknown>> = {
  data: T[];
  xKey: keyof T;
  series: Series[];
  height?: number;
};

export function MultiLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 280,
}: MultiLineChartProps<T>): React.ReactElement {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#d1d5db" />
        <XAxis
          dataKey={xKey as string}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#475569", fontSize: 12 }}
          tickMargin={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#475569", fontSize: 12 }}
          tickMargin={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "1px solid rgba(148, 163, 184, 0.24)",
            borderRadius: 16,
            color: "#fff",
          }}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: 12 }}
          iconType="circle"
        />
        {series.map((serie) => (
          <Line
            key={serie.dataKey}
            type="monotone"
            dataKey={serie.dataKey}
            name={serie.name}
            stroke={serie.color}
            strokeWidth={2.8}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

