// ============================================================
// Export Controller — CSV and JSON report exports
// ============================================================

const prisma = require("../config/db");
const { buildWhereClause } = require("../analytics-engine/analyticsProcessor");

/**
 * GET /api/export/report
 * Query params: format (csv|json), region, service, timePeriod, category
 */
async function exportReport(req, res, next) {
  try {
    const format = (req.query.format || "json").toLowerCase();

    const filters = {
      region: req.query.region || null,
      service: req.query.service || null,
      timePeriod: req.query.timePeriod || null,
      category: req.query.category || null,
    };

    const where = buildWhereClause(filters);

    const records = await prisma.fapControlData.findMany({
      where,
      include: { region: true, service: true, period: true, category: true },
      orderBy: { id: "asc" },
    });

    // Flatten records for export
    const flatRecords = records.map((r) => ({
      id: r.id,
      region: r.region.regionName,
      service: r.service.serviceName,
      timePeriod: r.period.periodName,
      category: r.category.categoryName,
      activeUsers: r.activeUsers,
      nonRenewalUsers: r.nonRenewalUsers,
      revenue: r.revenue,
      occupancyPercentage: r.occupancyPercentage,
      dataUsage: r.dataUsage,
      callVolume: r.callVolume,
      peakUsageTime: r.peakUsageTime,
      createdAt: r.createdAt,
    }));

    if (format === "csv") {
      const { Parser } = require("json2csv");
      const fields = [
        "id", "region", "service", "timePeriod", "category",
        "activeUsers", "nonRenewalUsers", "revenue",
        "occupancyPercentage", "dataUsage", "callVolume",
        "peakUsageTime", "createdAt",
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(flatRecords);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=ntc_insight_report.csv");
      return res.send(csv);
    }

    // Default: JSON
    res.json({
      success: true,
      totalRecords: flatRecords.length,
      data: flatRecords,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { exportReport };
