// ============================================================
// Dashboard Controller — Pre-aggregated dashboard endpoints
// ============================================================

const analytics = require("../analytics-engine/analyticsProcessor");

/**
 * GET /api/dashboard/customers
 */
async function getCustomerSummary(req, res, next) {
  try {
    const result = await analytics.getCustomerSummary();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/revenue
 */
async function getRevenueSummary(req, res, next) {
  try {
    const result = await analytics.getRevenueSummary();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/services
 */
async function getServiceOverview(req, res, next) {
  try {
    const result = await analytics.getServiceOverview();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/fap-occupancy
 */
async function getFapOccupancy(req, res, next) {
  try {
    const result = await analytics.getFapOccupancy();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCustomerSummary, getRevenueSummary, getServiceOverview, getFapOccupancy };
