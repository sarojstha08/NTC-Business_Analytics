// ============================================================
// Dashboard Routes
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getCustomerSummary,
  getRevenueSummary,
  getServiceOverview,
  getFapOccupancy,
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

// All dashboard routes require authentication
router.use(authenticate);

router.get("/customers", getCustomerSummary);
router.get("/revenue", getRevenueSummary);
router.get("/services", getServiceOverview);
router.get("/fap-occupancy", getFapOccupancy);

module.exports = router;
