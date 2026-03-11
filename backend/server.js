// ============================================================
// Express Server Entry Point — NTC Insight Hub Backend
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

// --- Route imports ---
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dataRoutes = require("./routes/dataRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Security ---
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
  ],
  credentials: true,
}));

// --- Rate limiting: 100 requests per 15 minutes ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." },
});
app.use(limiter);

// --- Body parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "NTC Insight Hub API is running.", timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/export", exportRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

// --- Global error handler ---
app.use(errorHandler);

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ NTC Insight Hub API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
