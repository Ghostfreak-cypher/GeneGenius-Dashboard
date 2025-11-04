"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  { day: "Mon", active: 142, pending: 23 },
  { day: "Tue", active: 167, pending: 19 },
  { day: "Wed", active: 189, pending: 15 },
  { day: "Thu", active: 156, pending: 28 },
  { day: "Fri", active: 178, pending: 21 },
  { day: "Sat", active: 94, pending: 12 },
  { day: "Sun", active: 87, pending: 8 },
];

const chartConfig = {
  active: {
    label: "Active Users",
    color: "hsl(0 0% 9%)",
  },
  pending: {
    label: "Pending Approvals",
    color: "hsl(0 0% 70%)",
  },
} satisfies ChartConfig;

export function UserActivityChart() {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">User Activity</CardTitle>
        <CardDescription className="text-neutral-600">
          Daily user engagement over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} stroke="hsl(0 0% 90%)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(0 0% 45%)" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="active" fill="hsl(0 0% 9%)" radius={4} />
            <Bar dataKey="pending" fill="hsl(0 0% 70%)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
