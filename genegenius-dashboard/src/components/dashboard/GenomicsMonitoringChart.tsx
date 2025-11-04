"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Filter, MoreVertical, Settings } from "lucide-react";

const chartData = [
  { time: "06:00", snp19A: 8, snp20A: 5, snp20H_Beta: 12, snp20I_Alpha: 15 },
  { time: "08:00", snp19A: 10, snp20A: 7, snp20H_Beta: 14, snp20I_Alpha: 18 },
  { time: "10:00", snp19A: 12, snp20A: 9, snp20H_Beta: 16, snp20I_Alpha: 20 },
  { time: "12:00", snp19A: 15, snp20A: 12, snp20H_Beta: 18, snp20I_Alpha: 20 },
  { time: "14:00", snp19A: 18, snp20A: 14, snp20H_Beta: 18, snp20I_Alpha: 20 },
  { time: "16:00", snp19A: 18, snp20A: 16, snp20H_Beta: 18, snp20I_Alpha: 20 },
  { time: "18:00", snp19A: 18, snp20A: 18, snp20H_Beta: 18, snp20I_Alpha: 22 },
  { time: "20:00", snp19A: 16, snp20A: 20, snp20H_Beta: 18, snp20I_Alpha: 24 },
  { time: "22:00", snp19A: 14, snp20A: 22, snp20H_Beta: 16, snp20I_Alpha: 20 },
  { time: "00:00", snp19A: 12, snp20A: 20, snp20H_Beta: 12, snp20I_Alpha: 18 },
];

const chartConfig = {
  snp19A: {
    label: "19A",
    color: "#8b5cf6",
  },
  snp20A: {
    label: "20A",
    color: "#fbbf24",
  },
  snp20H_Beta: {
    label: "20H (Beta, V2)",
    color: "#34d399",
  },
  snp20I_Alpha: {
    label: "20I (Alpha, V1)",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function GenomicsMonitoringChart() {
  return (
    <Card className="bg-[#1a1f28] border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg font-medium">
              Genomics monitoring
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-800 rounded-md transition-colors">
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-gray-800 rounded-md transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            <span className="text-blue-400">◉</span>
            SNP-based
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>4 Selected</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { label: "• 19A", color: "#8b5cf6" },
            { label: "• 20A", color: "#fbbf24" },
            { label: "• 20H (Beta, V2)", color: "#34d399" },
            { label: "• 20I (Alpha, V1)", color: "#60a5fa" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2 py-1 bg-[#0f1419] border border-gray-700 rounded text-xs text-gray-300"
            >
              <span style={{ color: item.color }}>●</span>
              {item.label}
              <button className="ml-1 text-gray-500 hover:text-gray-300">
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded">
            <span className="text-gray-400">📅</span>
            <span className="text-gray-300">Oct 10, 18:00</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded">
            <span className="text-gray-400">📅</span>
            <span className="text-gray-300">Oct 11, 18:00</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="stepAfter"
              dataKey="snp19A"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="snp20A"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="snp20H_Beta"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="snp20I_Alpha"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
