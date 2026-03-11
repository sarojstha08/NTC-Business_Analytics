import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { exportReport } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================
// Reports Page — fetches data from backend export API
// Preview table + PDF and CSV export
// ============================================================

const regions = ["All", "NT Kirtipur", "NT Balambu", "NT Dhading"];

interface ReportRow {
  id: number;
  region: string;
  service: string;
  timePeriod: string;
  category: string;
  activeUsers: number;
  nonRenewalUsers: number;
  revenue: number;
  occupancyPercentage: number;
}

export default function Reports() {
  const [region, setRegion] = useState("All");
  const [data, setData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await exportReport("json", { region });
        setData(res.data || []);
      } catch (err) {
        console.error("Failed to load report data:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [region]);

  // Export to PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Nepal Telecom — Analytics Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Region: ${region} | Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 34,
      head: [["Region", "Service", "Period", "Category", "Active Users", "Revenue", "Occupancy %"]],
      body: data.map((r) => [
        r.region, r.service, r.timePeriod, r.category,
        r.activeUsers, `Rs. ${r.revenue.toLocaleString()}`, `${r.occupancyPercentage}%`,
      ]),
    });

    doc.save("ntc-analytics-report.pdf");
  };

  // Export to CSV via backend
  const handleExportCsv = async () => {
    try {
      await exportReport("csv", { region });
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by Region</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportPdf} className="gap-2">
            <FileDown className="h-4 w-4" /> Export to PDF
          </Button>
          <Button onClick={handleExportCsv} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Export to CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Loading report data...</div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Active Users</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Occupancy %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.region}</TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>{row.timePeriod}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right">{row.activeUsers.toLocaleString()}</TableCell>
                    <TableCell className="text-right">Rs. {row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.occupancyPercentage}%</TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Showing {data.length} records {region !== "All" ? `for ${region}` : ""}
        </p>
      </main>
    </div>
  );
}
