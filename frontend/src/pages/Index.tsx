import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/KpiCard";
import { FilterBar, Filters } from "@/components/FilterBar";
import { DashboardCharts } from "@/components/DashboardCharts";
import { fetchAnalytics, fetchFapOccupancy } from "@/lib/api";

// ============================================================
// Main Dashboard Page
// KPIs + charts auto-update on EVERY filter change (no button).
// FAP Occupancy cards restored below the charts.
// ============================================================

interface KpiItem {
  label: string;
  value: string;
  trend: number;
  icon: string;
}

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    region: "All",
    service: "All",
    timePeriod: "Monthly",
    customerCategory: "All",
  });

  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics + KPIs whenever ANY filter changes — no button needed
  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [analyticsRes, occRes] = await Promise.all([
          fetchAnalytics({
            region: filters.region,
            service: filters.service,
            timePeriod: filters.timePeriod,
            category: filters.customerCategory,
          }),
          fetchFapOccupancy(),
        ]);

        setChartData(analyticsRes);

        // Build KPIs from the filtered analytics
        const a = analyticsRes.analytics || {};
        const totalCustomers = (a.totalCustomers ?? 0);
        const avgOcc = a.occupancy ?? 0;

        setKpis([
          {
            label: "Total Customers",
            value: totalCustomers.toLocaleString(),
            trend: 5.2,
            icon: "Users",
          },
          {
            label: "Active Customers",
            value: (a.activeUsers ?? 0).toLocaleString(),
            trend: 3.8,
            icon: "UserCheck",
          },
          {
            label: "Non Renewal",
            value: (a.nonRenewalUsers ?? 0).toLocaleString(),
            trend: -2.1,
            icon: "Activity",
          },
          {
            label: "Avg FAP Occupancy",
            value: `${avgOcc}%`,
            trend: avgOcc > 70 ? -1.5 : 1.2,
            icon: "Activity",
          },
        ]);

        // FAP Occupancy data
        setOccupancyData(occRes.analytics?.occupancyData || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
      setLoading(false);
    }
    loadDashboard();
  }, [filters]); // ← re-runs on EVERY filter change

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {/* KPI Cards — auto-update on filter change */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        {/* Filters — selecting any option triggers immediate refresh */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Charts */}
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Loading charts...</div>
        ) : (
          <DashboardCharts chartData={chartData} />
        )}

        {/* FAP Occupancy Status — restored */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">FAP Occupancy Status</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {occupancyData.map((item: any, i: number) => (
              <div key={i} className="rounded-lg border bg-card p-4 space-y-2 transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{item.region}</h3>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                    item.occupancy < 70 ? "bg-[hsl(var(--ntc-success))]" :
                    item.occupancy <= 90 ? "bg-[hsl(var(--ntc-warning))]" :
                    "bg-[hsl(var(--ntc-danger))]"
                  }`}>
                    {item.occupancy < 70 ? "Normal" : item.occupancy <= 90 ? "High" : "Critical"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.service}</p>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Occupancy</p>
                    <p className="font-bold">{item.occupancy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Peak Time</p>
                    <p className="font-bold">{item.peak_usage_time}</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.occupancy < 70 ? "bg-[hsl(var(--ntc-success))]" :
                      item.occupancy <= 90 ? "bg-[hsl(var(--ntc-warning))]" :
                      "bg-[hsl(var(--ntc-danger))]"
                    }`}
                    style={{ width: `${Math.min(item.occupancy, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
