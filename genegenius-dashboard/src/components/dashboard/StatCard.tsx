import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-neutral-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900">{value}</div>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-neutral-600 mt-1">
            <span
              className={
                trend.value >= 0 ? "text-neutral-900" : "text-neutral-500"
              }
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>{" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
