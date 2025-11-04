"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  { month: "Jan", sequences: 2847, variants: 1245 },
  { month: "Feb", sequences: 3251, variants: 1456 },
  { month: "Mar", sequences: 2973, variants: 1389 },
  { month: "Apr", sequences: 3542, variants: 1678 },
  { month: "May", sequences: 3891, variants: 1834 },
  { month: "Jun", sequences: 4123, variants: 1952 },
];

const chartConfig = {
  sequences: {
    label: "Sequences Analyzed",
    color: "hsl(0 0% 9%)",
  },
  variants: {
    label: "Variants Identified",
    color: "hsl(0 0% 45%)",
  },
} satisfies ChartConfig;

export function GeneAnalysisChart() {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">
          Gene Sequence Analysis
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Monthly analysis trends for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(0 0% 90%)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(0 0% 45%)" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="variants"
              type="natural"
              fill="hsl(0 0% 85%)"
              fillOpacity={0.4}
              stroke="hsl(0 0% 45%)"
              stackId="a"
            />
            <Area
              dataKey="sequences"
              type="natural"
              fill="hsl(0 0% 20%)"
              fillOpacity={0.8}
              stroke="hsl(0 0% 9%)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
