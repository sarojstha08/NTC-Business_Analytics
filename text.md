

# Nepal Telecom (NTC) Business Analytics Dashboard

## Overview
A professional, corporate-style analytics dashboard for Nepal Telecom with role-based access, KPI tracking, FAP occupancy monitoring, and report generation — all using mock data with clean, reusable components.

## Design & Theme
- **Corporate blue (#1a56db) and white** color scheme with NTC branding
- **Top navbar layout** (no sidebar)
- Minimal, modern enterprise aesthetic
- Fully responsive across desktop, tablet, and mobile

---

## Pages

### 1. Login Page
- Clean centered login form with NTC branding/logo
- Email and password fields with validation feedback
- Role selector (Admin / Analyst) 
- "Sign In" button that redirects to the Dashboard
- Mock authentication stored in React state/context

### 2. Main Dashboard
**Top Navbar:**
- NTC Logo on the left
- Navigation links: Dashboard, FAP Control (Admin only), Reports
- User profile dropdown with role display and Logout option

**KPI Cards (4-card grid):**
- Total Customers, Active Customers, Revenue Summary, Avg FAP Occupancy %
- Each card with icon, value, and trend indicator

**Filters Section:**
- Dropdowns for Region, Service, Time Period, Customer Category
- "Apply Filter" button that updates dashboard data from mock datasets

**Analytics Charts (2x2 grid):**
- Revenue Bar Chart
- Customer Growth Line Chart
- Service Distribution Pie Chart
- Occupancy Trend Line Chart
- Built with Recharts (already installed)

**FAP Occupancy Cards:**
- Grid of cards showing FAP Name, Region, Capacity, Usage, Occupancy %
- Color-coded status badges: Green (<70%), Yellow (70-90%), Red (>90%)

### 3. FAP Control Page (Admin Only)
- Protected route — only visible/accessible for Admin role
- Data table listing all FAPs with Name, Region, Capacity, Usage, Occupancy %
- Edit button per row opens a modal dialog
- Modal allows updating FAP capacity with automatic occupancy recalculation
- Save updates reflected immediately in the UI

### 4. Reports Page
- Preview data table showing key metrics
- "Export to PDF" button (generates client-side PDF)
- "Export to Excel" button (generates client-side Excel/CSV)
- Filter controls to customize what data is exported

---

## Architecture
- **Auth Context** for managing login state and role-based access
- **Mock data module** with realistic Nepal Telecom data (regions, FAPs, revenue figures)
- **Reusable components**: KPI Card, Filter Bar, Chart Wrapper, FAP Card, Data Table, Status Badge
- **Protected Route wrapper** for admin-only pages
- All complex logic will be well-commented

