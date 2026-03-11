import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
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
import { Pencil, Trash2, Plus } from "lucide-react";
import { fetchFapOccupancy, addFapRecord, updateFapRecord, deleteFapRecord } from "@/lib/api";

// ============================================================
// FAP Control Page — Admin only
// Full CRUD with backend API integration
// ============================================================

interface FapRow {
  id: number;
  region: string;
  service: string;
  activeUsers: number;
  occupancyPercentage: number;
  peakUsageTime: string;
  revenue: number;
}

const statusColors: Record<string, string> = {
  success: "bg-[hsl(var(--ntc-success))] text-white hover:bg-[hsl(var(--ntc-success))]",
  warning: "bg-[hsl(var(--ntc-warning))] text-white hover:bg-[hsl(var(--ntc-warning))]",
  danger: "bg-[hsl(var(--ntc-danger))] text-white hover:bg-[hsl(var(--ntc-danger))]",
};

function getOccupancyStatus(o: number) {
  if (o < 70) return "success";
  if (o <= 90) return "warning";
  return "danger";
}

export default function FapControl() {
  const [data, setData] = useState<FapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FapRow | null>(null);
  const [editOccupancy, setEditOccupancy] = useState("");
  const [editRevenue, setEditRevenue] = useState("");
  const [editActiveUsers, setEditActiveUsers] = useState("");

  // Add dialog state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    regionId: "1", serviceId: "1", timePeriodId: "1", categoryId: "1",
    activeUsers: "500", nonRenewalUsers: "50", revenue: "100000",
    occupancyPercentage: "65", dataUsage: "300", callVolume: "5000", peakUsageTime: "8PM",
  });

  async function loadData() {
    try {
      const res = await fetchFapOccupancy();
      const rows: FapRow[] = (res.analytics?.occupancyData || []).map((item: any, i: number) => ({
        id: i + 1,
        region: item.region,
        service: item.service,
        activeUsers: 0,
        occupancyPercentage: item.occupancy,
        peakUsageTime: item.peak_usage_time,
        revenue: 0,
      }));
      setData(rows);
    } catch (err) {
      console.error("Failed to load FAP data:", err);
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const openEdit = (row: FapRow) => {
    setEditing(row);
    setEditOccupancy(String(row.occupancyPercentage));
    setEditRevenue(String(row.revenue));
    setEditActiveUsers(String(row.activeUsers));
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateFapRecord(editing.id, {
        occupancyPercentage: parseFloat(editOccupancy),
        revenue: parseFloat(editRevenue),
        activeUsers: parseInt(editActiveUsers),
      });
      setEditing(null);
      loadData();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try {
      await deleteFapRecord(id);
      loadData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAdd = async () => {
    try {
      await addFapRecord({
        regionId: parseInt(addForm.regionId),
        serviceId: parseInt(addForm.serviceId),
        timePeriodId: parseInt(addForm.timePeriodId),
        categoryId: parseInt(addForm.categoryId),
        activeUsers: parseInt(addForm.activeUsers),
        nonRenewalUsers: parseInt(addForm.nonRenewalUsers),
        revenue: parseFloat(addForm.revenue),
        occupancyPercentage: parseFloat(addForm.occupancyPercentage),
        dataUsage: parseFloat(addForm.dataUsage),
        callVolume: parseInt(addForm.callVolume),
        peakUsageTime: addForm.peakUsageTime,
      });
      setShowAdd(false);
      loadData();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FAP Control Panel</h1>
            <p className="text-muted-foreground text-sm">Manage FAP data and monitor occupancy levels.</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Loading...</div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Occupancy %</TableHead>
                  <TableHead>Peak Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => {
                  const status = getOccupancyStatus(row.occupancyPercentage);
                  return (
                    <TableRow key={`${row.region}-${row.service}`}>
                      <TableCell className="font-medium">{row.region}</TableCell>
                      <TableCell>{row.service}</TableCell>
                      <TableCell className="text-right">{row.occupancyPercentage}%</TableCell>
                      <TableCell>{row.peakUsageTime}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusColors[status]}>
                          {status === "success" ? "Normal" : status === "warning" ? "High" : "Critical"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button variant="outline" size="sm" onClick={() => openEdit(row)} className="gap-1">
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(row.id)} className="gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit FAP Record</DialogTitle>
              <DialogDescription>
                Update the record for {editing?.region} — {editing?.service}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="editOccupancy">Occupancy %</Label>
                <Input id="editOccupancy" type="number" value={editOccupancy} onChange={(e) => setEditOccupancy(e.target.value)} min={0} max={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRevenue">Revenue</Label>
                <Input id="editRevenue" type="number" value={editRevenue} onChange={(e) => setEditRevenue(e.target.value)} min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editActive">Active Users</Label>
                <Input id="editActive" type="number" value={editActiveUsers} onChange={(e) => setEditActiveUsers(e.target.value)} min={0} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Modal */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAP Record</DialogTitle>
              <DialogDescription>Create a new FAP control data entry.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Region ID</Label><Input type="number" value={addForm.regionId} onChange={(e) => setAddForm({...addForm, regionId: e.target.value})} /></div>
                <div><Label>Service ID</Label><Input type="number" value={addForm.serviceId} onChange={(e) => setAddForm({...addForm, serviceId: e.target.value})} /></div>
                <div><Label>Time Period ID</Label><Input type="number" value={addForm.timePeriodId} onChange={(e) => setAddForm({...addForm, timePeriodId: e.target.value})} /></div>
                <div><Label>Category ID</Label><Input type="number" value={addForm.categoryId} onChange={(e) => setAddForm({...addForm, categoryId: e.target.value})} /></div>
                <div><Label>Active Users</Label><Input type="number" value={addForm.activeUsers} onChange={(e) => setAddForm({...addForm, activeUsers: e.target.value})} /></div>
                <div><Label>Non Renewal</Label><Input type="number" value={addForm.nonRenewalUsers} onChange={(e) => setAddForm({...addForm, nonRenewalUsers: e.target.value})} /></div>
                <div><Label>Revenue</Label><Input type="number" value={addForm.revenue} onChange={(e) => setAddForm({...addForm, revenue: e.target.value})} /></div>
                <div><Label>Occupancy %</Label><Input type="number" value={addForm.occupancyPercentage} onChange={(e) => setAddForm({...addForm, occupancyPercentage: e.target.value})} /></div>
                <div><Label>Data Usage</Label><Input type="number" value={addForm.dataUsage} onChange={(e) => setAddForm({...addForm, dataUsage: e.target.value})} /></div>
                <div><Label>Call Volume</Label><Input type="number" value={addForm.callVolume} onChange={(e) => setAddForm({...addForm, callVolume: e.target.value})} /></div>
              </div>
              <div><Label>Peak Usage Time</Label><Input value={addForm.peakUsageTime} onChange={(e) => setAddForm({...addForm, peakUsageTime: e.target.value})} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
