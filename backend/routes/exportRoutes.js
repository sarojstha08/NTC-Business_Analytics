// ============================================================
// Export Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { exportReport } = require("../controllers/exportController");
const { authenticate } = require("../middleware/auth");

// GET /api/export/report — requires authentication
router.get("/report", authenticate, exportReport);

module.exports = router;
