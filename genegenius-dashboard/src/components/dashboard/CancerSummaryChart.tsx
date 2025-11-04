"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MoreVertical } from "lucide-react";

const chartData = [
  { time: "17:00", value: 1.352 },
  { time: "17:30", value: 1.834 },
  { time: "18:00", value: 1.245 },
  { time: "18:30", value: 0.934 },
  { time: "19:00", value: 1.412 },
  { time: "19:30", value: 1.053 },
  { time: "20:00", value: 1.338 },
];

// Generate stable heatmap data
const heatmapIntensities = Array.from({ length: 7 * 12 }, (_, i) => {
  // Use index-based seeding for stable values
  return ((i * 7 + i * 13) % 100) / 100;
});

const chartConfig = {
  value: {
    label: "Tempo (bpm)",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function CancerSummaryChart() {
  return (
    <Card className="bg-[#1a1f28] border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-medium">
            Cancer summary
          </CardTitle>
          <button className="p-1.5 hover:bg-gray-800 rounded-md transition-colors">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <div className="mt-3">
          <select className="px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            <option>Custom</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heatmap Section */}
        <div className="relative h-[180px] bg-[#0f1419] rounded-lg p-3">
          <div className="grid grid-cols-7 gap-1 h-full">
            {heatmapIntensities.map((intensity, i) => {
              const colors = [
                "#1f2937",
                "#374151",
                "#4b5563",
                "#60a5fa",
                "#3b82f6",
                "#2563eb",
                "#fbbf24",
              ];
              const colorIndex = Math.floor(intensity * (colors.length - 1));
              return (
                <div
                  key={i}
                  className="rounded-sm transition-all hover:scale-110"
                  style={{
                    backgroundColor: colors[colorIndex],
                    opacity: 0.4 + intensity * 0.6,
                  }}
                />
              );
            })}
          </div>
          {/* Time labels */}
          <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[10px] text-gray-500">
            <span>17:00</span>
            <span>18:00</span>
            <span>19:00</span>
            <span>20:00</span>
          </div>
          {/* Vertical markers */}
          <div className="absolute left-3 right-3 top-3 bottom-6 flex justify-between pointer-events-none">
            {[2, 4, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[10px] text-blue-300">
                  {i}
                </div>
                <div className="h-full w-px bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="relative">
          <div className="absolute top-0 right-0 text-xs space-y-1">
            <div className="text-gray-400">Oct 10, 17:00</div>
            <div className="text-white font-mono">
              <span className="text-gray-400">Tempo</span> 752.32
              <span className="text-xs text-gray-500 ml-1">bpm</span>
            </div>
            <div className="text-gray-400">Oct 10, 20:00</div>
            <div className="text-white font-mono">
              <span className="text-gray-400">Pulse</span> 38.76
              <span className="text-xs text-gray-500 ml-1">bpm</span>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 120, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 2]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs pt-2 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-linear-to-r from-yellow-400 to-green-400" />
            <span className="text-gray-400">Intensity Scale</span>
          </div>
          <div className="flex gap-1">
            {["#1f2937", "#60a5fa", "#fbbf24", "#34d399"].map((color, i) => (
              <div
                key={i}
                className="w-6 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
