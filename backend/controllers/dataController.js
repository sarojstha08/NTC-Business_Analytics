// ============================================================
// Data Controller — Admin CRUD for FAP Control Data
// ============================================================

const prisma = require("../config/db");

/**
 * Validate that foreign key references exist
 */
async function validateReferences(regionId, serviceId, timePeriodId, categoryId) {
  const [region, service, period, category] = await Promise.all([
    prisma.region.findUnique({ where: { id: regionId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.timePeriod.findUnique({ where: { id: timePeriodId } }),
    prisma.customerCategory.findUnique({ where: { id: categoryId } }),
  ]);

  const errors = [];
  if (!region) errors.push(`Region with id ${regionId} does not exist`);
  if (!service) errors.push(`Service with id ${serviceId} does not exist`);
  if (!period) errors.push(`Time period with id ${timePeriodId} does not exist`);
  if (!category) errors.push(`Customer category with id ${categoryId} does not exist`);

  return errors;
}

/**
 * POST /api/data/add
 */
async function addRecord(req, res, next) {
  try {
    const {
      regionId, serviceId, timePeriodId, categoryId,
      activeUsers, nonRenewalUsers, revenue,
      occupancyPercentage, dataUsage, callVolume, peakUsageTime,
    } = req.body;

    // Validate references
    const errors = await validateReferences(regionId, serviceId, timePeriodId, categoryId);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const record = await prisma.fapControlData.create({
      data: {
        regionId, serviceId, timePeriodId, categoryId,
        activeUsers, nonRenewalUsers, revenue,
        occupancyPercentage, dataUsage, callVolume, peakUsageTime,
      },
      include: { region: true, service: true, period: true, category: true },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/data/update/:id
 */
async function updateRecord(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid record ID." });
    }

    // Check record exists
    const existing = await prisma.fapControlData.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Record not found." });
    }

    const data = {};
    const fields = [
      "regionId", "serviceId", "timePeriodId", "categoryId",
      "activeUsers", "nonRenewalUsers", "revenue",
      "occupancyPercentage", "dataUsage", "callVolume", "peakUsageTime",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    });

    // Validate references if any FK field is being updated
    if (data.regionId || data.serviceId || data.timePeriodId || data.categoryId) {
      const errors = await validateReferences(
        data.regionId || existing.regionId,
        data.serviceId || existing.serviceId,
        data.timePeriodId || existing.timePeriodId,
        data.categoryId || existing.categoryId
      );
      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
      }
    }

    const record = await prisma.fapControlData.update({
      where: { id },
      data,
      include: { region: true, service: true, period: true, category: true },
    });

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/data/delete/:id
 */
async function deleteRecord(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid record ID." });
    }

    const existing = await prisma.fapControlData.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Record not found." });
    }

    await prisma.fapControlData.delete({ where: { id } });

    res.json({ success: true, message: "Record deleted successfully." });
  } catch (err) {
    next(err);
  }
}

module.exports = { addRecord, updateRecord, deleteRecord };
