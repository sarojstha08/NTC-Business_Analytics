// ============================================================
// Analytics Controller — Filtered analytics endpoint
// ============================================================

const { getFilteredAnalytics } = require("../analytics-engine/analyticsProcessor");

/**
 * GET /api/analytics
 * Query params: region, service, timePeriod, category
 */
async function getAnalytics(req, res, next) {
  try {
    const filters = {
      region: req.query.region || null,
      service: req.query.service || null,
      timePeriod: req.query.timePeriod || null,
      category: req.query.category || null,
    };

    const result = await getFilteredAnalytics(filters);

    // Build active filters for response
    const activeFilters = {};
    if (filters.region) activeFilters.region = filters.region;
    if (filters.service) activeFilters.service = filters.service;
    if (filters.timePeriod) activeFilters.timePeriod = filters.timePeriod;
    if (filters.category) activeFilters.category = filters.category;

    res.json({
      success: true,
      filters: activeFilters,
      analytics: result.analytics,
      charts: result.charts,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };
