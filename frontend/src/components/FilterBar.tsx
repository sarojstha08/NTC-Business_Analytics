import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================
// Filter options matching backend database values
// No "Apply" button — selections trigger immediate data refresh
// ============================================================
const regions = ["All", "NT Kirtipur", "NT Balambu", "NT Dhading"];
const services = ["All", "Data", "Voice Pack", "IPTV", "New Connection"];
const timePeriods = ["Monthly", "Quarterly", "Yearly", "6 Months"];
const customerCategories = ["All", "Renewal Customer", "Non Renewal Customer"];

export interface Filters {
  region: string;
  service: string;
  timePeriod: string;
  customerCategory: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Region</label>
        <Select value={filters.region} onValueChange={(v) => update("region", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Service</label>
        <Select value={filters.service} onValueChange={(v) => update("service", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Time Period</label>
        <Select value={filters.timePeriod} onValueChange={(v) => update("timePeriod", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            {timePeriods.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Customer Category</label>
        <Select value={filters.customerCategory} onValueChange={(v) => update("customerCategory", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            {customerCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
