import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { initialFapData, FAP } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { getOccupancyStatus } from "@/data/mockData";
import { Pencil } from "lucide-react";

// ============================================================
// FAP Control Page — Admin only
// Table of FAPs with edit modal for capacity updates
// Occupancy is recalculated automatically on save
// ============================================================

const statusColors: Record<string, string> = {
  success: "bg-[hsl(var(--ntc-success))] text-white hover:bg-[hsl(var(--ntc-success))]",
  warning: "bg-[hsl(var(--ntc-warning))] text-white hover:bg-[hsl(var(--ntc-warning))]",
  danger: "bg-[hsl(var(--ntc-danger))] text-white hover:bg-[hsl(var(--ntc-danger))]",
};

export default function FapControl() {
  const [faps, setFaps] = useState<FAP[]>(initialFapData);
  const [editing, setEditing] = useState<FAP | null>(null);
  const [newCapacity, setNewCapacity] = useState("");

  const openEdit = (fap: FAP) => {
    setEditing(fap);
    setNewCapacity(String(fap.capacity));
  };

  const handleSave = () => {
    if (!editing) return;
    const cap = parseInt(newCapacity, 10);
    if (isNaN(cap) || cap <= 0) return;

    // Recalculate occupancy = (usage / newCapacity) * 100
    setFaps((prev) =>
      prev.map((f) =>
        f.id === editing.id
          ? { ...f, capacity: cap, occupancy: parseFloat(((f.usage / cap) * 100).toFixed(1)) }
          : f
      )
    );
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">FAP Control Panel</h1>
        <p className="text-muted-foreground text-sm">Manage FAP capacities and monitor occupancy levels.</p>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FAP Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead className="text-right">Occupancy %</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faps.map((fap) => {
                const status = getOccupancyStatus(fap.occupancy);
                return (
                  <TableRow key={fap.id}>
                    <TableCell className="font-medium">{fap.name}</TableCell>
                    <TableCell>{fap.region}</TableCell>
                    <TableCell className="text-right">{fap.capacity}</TableCell>
                    <TableCell className="text-right">{fap.usage}</TableCell>
                    <TableCell className="text-right">{fap.occupancy.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      <Badge className={statusColors[status]}>
                        {status === "success" ? "Normal" : status === "warning" ? "High" : "Critical"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" onClick={() => openEdit(fap)} className="gap-1">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Edit Modal */}
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit FAP Capacity</DialogTitle>
              <DialogDescription>
                Update the capacity for {editing?.name}. Occupancy will be recalculated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Region:</span> {editing?.region}</div>
                <div><span className="text-muted-foreground">Current Usage:</span> {editing?.usage}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">New Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  min={1}
                />
              </div>
              {newCapacity && editing && parseInt(newCapacity) > 0 && (
                <p className="text-sm text-muted-foreground">
                  New Occupancy: {((editing.usage / parseInt(newCapacity)) * 100).toFixed(1)}%
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
