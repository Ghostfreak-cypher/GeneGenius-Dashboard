"use client";

import { Label, Pie, PieChart } from "recharts";
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
  { status: "completed", samples: 1247, fill: "hsl(0 0% 9%)" },
  { status: "processing", samples: 342, fill: "hsl(0 0% 40%)" },
  { status: "queued", samples: 156, fill: "hsl(0 0% 70%)" },
  { status: "failed", samples: 28, fill: "hsl(0 0% 85%)" },
];

const chartConfig = {
  samples: {
    label: "Samples",
  },
  completed: {
    label: "Completed",
    color: "hsl(0 0% 9%)",
  },
  processing: {
    label: "Processing",
    color: "hsl(0 0% 40%)",
  },
  queued: {
    label: "Queued",
    color: "hsl(0 0% 70%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0 0% 85%)",
  },
} satisfies ChartConfig;

export function ProcessingStatusChart() {
  const totalSamples = chartData.reduce((acc, curr) => acc + curr.samples, 0);

  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Processing Status</CardTitle>
        <CardDescription className="text-neutral-600">
          Current sample processing distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="samples"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              stroke="hsl(0 0% 100%)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-neutral-900 text-3xl font-bold"
                        >
                          {totalSamples.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-neutral-500 text-sm"
                        >
                          Total Samples
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
