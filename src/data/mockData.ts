// ============================================================
// Mock data module for Nepal Telecom Business Analytics Dashboard
// Contains realistic NTC data for regions, FAPs, revenue, etc.
// ============================================================

export type Role = "Admin" | "Analyst";

export interface User {
  email: string;
  name: string;
  role: Role;
}

export interface FAP {
  id: string;
  name: string;
  region: string;
  capacity: number;
  usage: number;
  occupancy: number; // computed: (usage / capacity) * 100
}

export interface KPI {
  label: string;
  value: string;
  trend: number; // percentage change
  icon: string;  // lucide icon name
}

// --- Regions ---
export const regions = ["All", "Kirtipur", "Balambu", "Dhading"];
export const services = ["All", "Data", "Voice", "IPTV", "New Connection"];
export const timePeriods = ["Monthly", "Quarterly", "Yearly"];
export const customerCategories = ["All", "Renewal", "Non-Renewal"];

// --- Mock Users ---
export const mockUsers: User[] = [
  { email: "admin@ntc.net.np", name: "Rajesh Sharma", role: "Admin" },
  { email: "analyst@ntc.net.np", name: "Sita Gurung", role: "Analyst" },
];

// --- KPI Data ---
export const kpiData: KPI[] = [
  { label: "Total Customers", value: "1,24,580", trend: 5.2, icon: "Users" },
  { label: "Active Customers", value: "98,340", trend: 3.8, icon: "UserCheck" },
  { label: "Revenue Summary", value: "Rs. 45.2 Cr", trend: 7.1, icon: "IndianRupee" },
  { label: "Avg FAP Occupancy", value: "72.4%", trend: -2.3, icon: "Activity" },
];

// --- FAP Data ---
export const initialFapData: FAP[] = [
  { id: "fap-1", name: "FAP-KTP-001", region: "Kirtipur", capacity: 500, usage: 320, occupancy: 64 },
  { id: "fap-2", name: "FAP-KTP-002", region: "Kirtipur", capacity: 400, usage: 350, occupancy: 87.5 },
  { id: "fap-3", name: "FAP-BLM-001", region: "Balambu", capacity: 600, usage: 580, occupancy: 96.7 },
  { id: "fap-4", name: "FAP-BLM-002", region: "Balambu", capacity: 450, usage: 290, occupancy: 64.4 },
  { id: "fap-5", name: "FAP-DHD-001", region: "Dhading", capacity: 350, usage: 260, occupancy: 74.3 },
  { id: "fap-6", name: "FAP-DHD-002", region: "Dhading", capacity: 300, usage: 180, occupancy: 60 },
  { id: "fap-7", name: "FAP-KTP-003", region: "Kirtipur", capacity: 550, usage: 510, occupancy: 92.7 },
  { id: "fap-8", name: "FAP-BLM-003", region: "Balambu", capacity: 480, usage: 310, occupancy: 64.6 },
];

// --- Revenue Chart Data (by month) ---
export const revenueData = [
  { month: "Baisakh", revenue: 3800 },
  { month: "Jestha", revenue: 4200 },
  { month: "Ashadh", revenue: 3900 },
  { month: "Shrawan", revenue: 4500 },
  { month: "Bhadra", revenue: 4100 },
  { month: "Ashwin", revenue: 4700 },
  { month: "Kartik", revenue: 5200 },
  { month: "Mangsir", revenue: 4800 },
  { month: "Poush", revenue: 4300 },
  { month: "Magh", revenue: 4600 },
  { month: "Falgun", revenue: 5100 },
  { month: "Chaitra", revenue: 5400 },
];

// --- Customer Growth Data ---
export const customerGrowthData = [
  { month: "Baisakh", customers: 112000 },
  { month: "Jestha", customers: 114500 },
  { month: "Ashadh", customers: 115800 },
  { month: "Shrawan", customers: 117200 },
  { month: "Bhadra", customers: 118900 },
  { month: "Ashwin", customers: 120100 },
  { month: "Kartik", customers: 121500 },
  { month: "Mangsir", customers: 122300 },
  { month: "Poush", customers: 122800 },
  { month: "Magh", customers: 123400 },
  { month: "Falgun", customers: 124000 },
  { month: "Chaitra", customers: 124580 },
];

// --- Service Distribution Data ---
export const serviceDistributionData = [
  { name: "Data", value: 45, fill: "hsl(221, 83%, 48%)" },
  { name: "Voice", value: 28, fill: "hsl(142, 71%, 45%)" },
  { name: "IPTV", value: 17, fill: "hsl(38, 92%, 50%)" },
  { name: "New Connection", value: 10, fill: "hsl(280, 65%, 55%)" },
];

// --- Occupancy Trend Data ---
export const occupancyTrendData = [
  { month: "Baisakh", occupancy: 68 },
  { month: "Jestha", occupancy: 70 },
  { month: "Ashadh", occupancy: 72 },
  { month: "Shrawan", occupancy: 75 },
  { month: "Bhadra", occupancy: 73 },
  { month: "Ashwin", occupancy: 71 },
  { month: "Kartik", occupancy: 74 },
  { month: "Mangsir", occupancy: 76 },
  { month: "Poush", occupancy: 72 },
  { month: "Magh", occupancy: 70 },
  { month: "Falgun", occupancy: 73 },
  { month: "Chaitra", occupancy: 72 },
];

// --- Filtered data helper ---
// Returns FAP data filtered by region
export function filterFapsByRegion(faps: FAP[], region: string): FAP[] {
  if (region === "All") return faps;
  return faps.filter((f) => f.region === region);
}

// Returns occupancy status color class based on percentage
export function getOccupancyStatus(occupancy: number): "success" | "warning" | "danger" {
  if (occupancy < 70) return "success";
  if (occupancy <= 90) return "warning";
  return "danger";
}
