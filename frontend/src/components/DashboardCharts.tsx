import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ============================================================
// Dashboard Charts — 6 chart cards in a 2×3 grid
// Revenue Pie, Active Users Bar, Customer Growth Line,
// Revenue by Period Line, FAP Occupancy Trend Line, Summary
// ============================================================

const COLORS = [
  "hsl(221, 83%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(195, 83%, 48%)",
];

interface DashboardChartsProps {
  chartData: {
    analytics?: {
      totalCustomers?: number;
      activeUsers?: number;
      nonRenewalUsers?: number;
      revenue?: number;
      occupancy?: number;
    };
    charts?: {
      pieChart?: { name: string; value: number }[];
      barChart?: { name: string; value: number }[];
      lineChart?: { name: string; value: number }[];
      customerGrowthChart?: { month: string; customers: number }[];
      occupancyTrendChart?: { month: string; occupancy: number }[];
    };
  } | null;
}

export function DashboardCharts({ chartData }: DashboardChartsProps) {
  if (!chartData || !chartData.charts) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No chart data available. Try adjusting your filters.
      </div>
    );
  }

  const {
    pieChart = [],
    barChart = [],
    lineChart = [],
    customerGrowthChart = [],
    occupancyTrendChart = [],
  } = chartData.charts;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Revenue by Service — Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue by Service</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {pieChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChart.map((_entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Customer Growth — Monthly Line Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Customer Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {customerGrowthChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Line type="monotone" dataKey="customers" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Customers" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Active Users by Region — Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active Users by Region</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {barChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(221, 83%, 48%)" radius={[4, 4, 0, 0]} name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Time Period — Line Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue by Time Period</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {lineChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="value" stroke="hsl(221, 83%, 48%)" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* FAP Occupancy Trend — Monthly Line Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">FAP Occupancy Trend (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {occupancyTrendChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrendChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="occupancy" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Occupancy %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {chartData.analytics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{chartData.analytics.totalCustomers?.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{chartData.analytics.activeUsers?.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {chartData.analytics.revenue?.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                <p className="text-2xl font-bold">{chartData.analytics.occupancy}%</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
