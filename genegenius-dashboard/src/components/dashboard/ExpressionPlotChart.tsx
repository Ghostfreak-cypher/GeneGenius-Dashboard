"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Filter, MoreVertical, Settings } from "lucide-react";
import { useState } from "react";

const chartData = [
  { date: "Oct 10, 2023", av12: 161, av3: 121, b112: 163, b117: 188 },
  { date: "Oct 11, 2023", av12: 232, av3: 63, b112: 175, b117: 284 },
];

const chartConfig = {
  av12: { label: "AY.12", color: "#a78bfa" },
  av3: { label: "AY.3", color: "#fbbf24" },
  b112: { label: "B.1.12", color: "#f472b6" },
  b117: { label: "B.1.1.7", color: "#34d399" },
} satisfies ChartConfig;

export function ExpressionPlotChart() {
  const latestValue = Math.max(
    ...chartData.map((d) => Math.max(d.av12, d.av3, d.b112, d.b117))
  );
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  return (
    <Card className="bg-[#1a1f28] border border-gray-800/60 rounded-2xl h-full transition-all duration-300 hover:border-gray-700/80 group">
      <CardHeader className="pb-3 h-[20%]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-semibold tracking-tight">
            Expression Plot
          </CardTitle>
          <div className="flex items-center gap-1">
            {[Filter, Settings, MoreVertical].map((Icon, i) => (
              <button
                key={i}
                className="p-2 hover:bg-gray-800/80 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label={
                  Icon === Filter
                    ? "Filter"
                    : Icon === Settings
                    ? "Settings"
                    : "More options"
                }
              >
                <Icon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[80%] flex flex-col">
        {/* Top Stat Display */}
        <div className="text-right mb-4 pb-3 border-b border-gray-800/50">
          <div className="flex items-baseline justify-end gap-2">
            <span className="text-4xl font-bold text-white tracking-tight tabular-nums">
              {latestValue}
            </span>
            <span className="text-base text-blue-400 font-medium">bgP</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Last Recorded Expression
          </p>
        </div>

        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 15, left: -15, bottom: 0 }}
                barGap={8}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af" }}
                  ticks={[0, 75, 150, 225, 300]}
                  domain={[0, 300]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-gray-900/95 border-gray-700" />
                  }
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                />
                {Object.entries(chartConfig).map(([key, conf]) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={conf.color}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                    onMouseEnter={() => setHoveredBar(key)}
                    onMouseLeave={() => setHoveredBar(null)}
                    opacity={
                      hoveredBar === null || hoveredBar === key ? 1 : 0.5
                    }
                    className="transition-opacity duration-200"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Enhanced Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-800/50">
          {Object.entries(chartConfig).map(([key, conf]) => (
            <button
              key={key}
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group/legend"
              onMouseEnter={() => setHoveredBar(key)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span
                className="inline-block w-3 h-3 rounded-full transition-transform duration-200 group-hover/legend:scale-110 shadow-sm"
                style={{
                  backgroundColor: conf.color,
                  boxShadow: `0 0 8px ${conf.color}40`,
                }}
              ></span>
              <span className="tracking-wide">{conf.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
