import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { initialFapData, regions, filterFapsByRegion } from "@/data/mockData";
import { FileDown, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================
// Reports Page
// Preview table + PDF and CSV export
// ============================================================

export default function Reports() {
  const [region, setRegion] = useState("All");
  const data = filterFapsByRegion(initialFapData, region);

  // Export to PDF using jspdf + autotable
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Nepal Telecom — FAP Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Region: ${region} | Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 34,
      head: [["FAP Name", "Region", "Capacity", "Usage", "Occupancy %"]],
      body: data.map((f) => [f.name, f.region, f.capacity, f.usage, `${f.occupancy.toFixed(1)}%`]),
    });

    doc.save("ntc-fap-report.pdf");
  };

  // Export to CSV
  const exportCsv = () => {
    const header = "FAP Name,Region,Capacity,Usage,Occupancy %\n";
    const rows = data.map((f) => `${f.name},${f.region},${f.capacity},${f.usage},${f.occupancy.toFixed(1)}%`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ntc-fap-report.csv";
    a.click();
    URL.revokeObjectURL(url);
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
          <Button onClick={exportPdf} className="gap-2">
            <FileDown className="h-4 w-4" /> Export to PDF
          </Button>
          <Button onClick={exportCsv} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Export to Excel (CSV)
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FAP Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead className="text-right">Occupancy %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((fap) => (
                <TableRow key={fap.id}>
                  <TableCell className="font-medium">{fap.name}</TableCell>
                  <TableCell>{fap.region}</TableCell>
                  <TableCell className="text-right">{fap.capacity}</TableCell>
                  <TableCell className="text-right">{fap.usage}</TableCell>
                  <TableCell className="text-right">{fap.occupancy.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
