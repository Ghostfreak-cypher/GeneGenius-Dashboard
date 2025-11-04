"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { week: "W1", throughput: 234, storage: 456 },
  { week: "W2", throughput: 312, storage: 523 },
  { week: "W3", throughput: 287, storage: 498 },
  { week: "W4", throughput: 398, storage: 612 },
  { week: "W5", throughput: 445, storage: 687 },
  { week: "W6", throughput: 412, storage: 654 },
  { week: "W7", throughput: 478, storage: 721 },
  { week: "W8", throughput: 523, storage: 789 },
];

const chartConfig = {
  throughput: {
    label: "Processing Throughput (GB)",
    color: "hsl(0 0% 9%)",
  },
  storage: {
    label: "Data Storage (GB)",
    color: "hsl(0 0% 50%)",
  },
} satisfies ChartConfig;

export function DataThroughputChart() {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Data Throughput</CardTitle>
        <CardDescription className="text-neutral-600">
          Processing and storage metrics over 8 weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(0 0% 90%)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(0 0% 45%)" }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="throughput"
              type="monotone"
              stroke="hsl(0 0% 9%)"
              strokeWidth={2}
              dot={{
                fill: "hsl(0 0% 9%)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="storage"
              type="monotone"
              stroke="hsl(0 0% 50%)"
              strokeWidth={2}
              dot={{
                fill: "hsl(0 0% 50%)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
