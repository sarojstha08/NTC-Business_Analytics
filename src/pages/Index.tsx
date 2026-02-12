import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/KpiCard";
import { FilterBar, Filters } from "@/components/FilterBar";
import { DashboardCharts } from "@/components/DashboardCharts";
import { FapCard } from "@/components/FapCard";
import { kpiData, initialFapData, filterFapsByRegion } from "@/data/mockData";

// ============================================================
// Main Dashboard Page
// Shows KPIs, filters, charts, and FAP occupancy cards
// ============================================================

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    region: "All",
    service: "All",
    timePeriod: "Monthly",
    customerCategory: "All",
  });
  const [appliedRegion, setAppliedRegion] = useState("All");

  const handleApply = () => {
    setAppliedRegion(filters.region);
  };

  const filteredFaps = filterFapsByRegion(initialFapData, appliedRegion);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} onApply={handleApply} />

        {/* Charts */}
        <DashboardCharts />

        {/* FAP Occupancy Cards */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">FAP Occupancy Status</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFaps.map((fap) => (
              <FapCard key={fap.id} fap={fap} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
