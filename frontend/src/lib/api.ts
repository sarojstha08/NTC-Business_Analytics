// ============================================================
// Centralized API Client — NTC Insight Hub
// All backend API calls go through this module
// ============================================================

const API_BASE = "http://localhost:5000/api";

/** Get stored JWT token */
function getToken(): string | null {
  return localStorage.getItem("ntc_token");
}

/** Set JWT token */
export function setToken(token: string): void {
  localStorage.setItem("ntc_token", token);
}

/** Remove JWT token */
export function removeToken(): void {
  localStorage.removeItem("ntc_token");
}

/** Get stored user */
export function getStoredUser() {
  const raw = localStorage.getItem("ntc_user");
  return raw ? JSON.parse(raw) : null;
}

/** Set stored user */
export function setStoredUser(user: { id: number; name: string; email: string; role: string }): void {
  localStorage.setItem("ntc_user", JSON.stringify(user));
}

/** Remove stored user */
export function removeStoredUser(): void {
  localStorage.removeItem("ntc_user");
}

/** Build fetch headers with auth */
function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Generic API fetch wrapper */
async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API Error: ${res.status}`);
  }
  return res.json();
}

// ============================================================
// Auth APIs
// ============================================================

export async function apiLogin(email: string, password: string) {
  return apiFetch<{
    success: boolean;
    data: {
      user: { id: number; name: string; email: string; role: string };
      token: string;
    };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(name: string, email: string, password: string, role: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

// ============================================================
// Analytics APIs
// ============================================================

export interface AnalyticsFilters {
  region?: string;
  service?: string;
  timePeriod?: string;
  category?: string;
}

export async function fetchAnalytics(filters: AnalyticsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.region && filters.region !== "All") params.set("region", filters.region);
  if (filters.service && filters.service !== "All") params.set("service", filters.service);
  if (filters.timePeriod) params.set("timePeriod", filters.timePeriod);
  if (filters.category && filters.category !== "All") params.set("category", filters.category);
  const qs = params.toString();
  return apiFetch(`/analytics${qs ? `?${qs}` : ""}`);
}

// ============================================================
// Dashboard APIs
// ============================================================

export async function fetchCustomerSummary() {
  return apiFetch("/dashboard/customers");
}

export async function fetchRevenueSummary() {
  return apiFetch("/dashboard/revenue");
}

export async function fetchServiceOverview() {
  return apiFetch("/dashboard/services");
}

export async function fetchFapOccupancy() {
  return apiFetch("/dashboard/fap-occupancy");
}

// ============================================================
// Data Management APIs (Admin only)
// ============================================================

export async function addFapRecord(data: Record<string, any>) {
  return apiFetch("/data/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFapRecord(id: number, data: Record<string, any>) {
  return apiFetch(`/data/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteFapRecord(id: number) {
  return apiFetch(`/data/delete/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// Export APIs
// ============================================================

export async function exportReport(format: "csv" | "json" = "json", filters: AnalyticsFilters = {}) {
  const params = new URLSearchParams();
  params.set("format", format);
  if (filters.region && filters.region !== "All") params.set("region", filters.region);
  if (filters.service && filters.service !== "All") params.set("service", filters.service);
  if (filters.timePeriod) params.set("timePeriod", filters.timePeriod);
  if (filters.category && filters.category !== "All") params.set("category", filters.category);

  if (format === "csv") {
    const token = getToken();
    const res = await fetch(`${API_BASE}/export/report?${params.toString()}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ntc_insight_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  return apiFetch(`/export/report?${params.toString()}`);
}
