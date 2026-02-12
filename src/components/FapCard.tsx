import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAP, getOccupancyStatus } from "@/data/mockData";

// Color maps for occupancy status badges
const statusColors: Record<string, string> = {
  success: "bg-[hsl(var(--ntc-success))] text-white hover:bg-[hsl(var(--ntc-success))]",
  warning: "bg-[hsl(var(--ntc-warning))] text-white hover:bg-[hsl(var(--ntc-warning))]",
  danger: "bg-[hsl(var(--ntc-danger))] text-white hover:bg-[hsl(var(--ntc-danger))]",
};

const statusLabels: Record<string, string> = {
  success: "Normal",
  warning: "High",
  danger: "Critical",
};

export function FapCard({ fap }: { fap: FAP }) {
  const status = getOccupancyStatus(fap.occupancy);

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{fap.name}</h3>
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{fap.region}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-bold">{fap.capacity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Usage</p>
            <p className="font-bold">{fap.usage}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Occupancy</p>
            <p className="font-bold">{fap.occupancy.toFixed(1)}%</p>
          </div>
        </div>
        {/* Visual progress bar for occupancy */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              status === "success" ? "bg-[hsl(var(--ntc-success))]" :
              status === "warning" ? "bg-[hsl(var(--ntc-warning))]" :
              "bg-[hsl(var(--ntc-danger))]"
            }`}
            style={{ width: `${Math.min(fap.occupancy, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
