import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, IndianRupee, Activity, TrendingUp, TrendingDown } from "lucide-react";

// Maps icon string names from mock data to actual Lucide components
const iconMap: Record<string, React.ElementType> = {
  Users, UserCheck, IndianRupee, Activity,
};

interface KpiCardProps {
  label: string;
  value: string;
  trend: number;
  icon: string;
}

export function KpiCard({ label, value, trend, icon }: KpiCardProps) {
  const Icon = iconMap[icon] || Activity;
  const isPositive = trend >= 0;

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground truncate">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-[hsl(var(--ntc-success))]" : "text-[hsl(var(--ntc-danger))]"}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
