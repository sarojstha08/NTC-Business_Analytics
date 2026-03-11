// ============================================================
// Database Seed Script — NTC Insight Hub
// Creates lookup data + 48 FAP records with HIGH variation
// so filter changes produce visually distinct chart results.
// ============================================================

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NTC Insight Hub database...\n");

  // --- Clear existing data ---
  await prisma.fapControlData.deleteMany();
  await prisma.customerCategory.deleteMany();
  await prisma.timePeriod.deleteMany();
  await prisma.service.deleteMany();
  await prisma.region.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const salt = await bcrypt.genSalt(10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Saroj Shrestha",
        email: "admin@ntc.net.np",
        password: await bcrypt.hash("admin123", salt),
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "Anupam Aryal",
        email: "analyst@ntc.net.np",
        password: await bcrypt.hash("analyst123", salt),
        role: "ANALYST",
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // --- Regions ---
  const regions = await Promise.all([
    prisma.region.create({ data: { regionName: "NT Kirtipur" } }),
    prisma.region.create({ data: { regionName: "NT Balambu" } }),
    prisma.region.create({ data: { regionName: "NT Dhading" } }),
  ]);
  console.log(`✅ Created ${regions.length} regions`);

  // --- Services ---
  const services = await Promise.all([
    prisma.service.create({ data: { serviceName: "Data" } }),
    prisma.service.create({ data: { serviceName: "Voice Pack" } }),
    prisma.service.create({ data: { serviceName: "IPTV" } }),
    prisma.service.create({ data: { serviceName: "New Connection" } }),
  ]);
  console.log(`✅ Created ${services.length} services`);

  // --- Time Periods ---
  const timePeriods = await Promise.all([
    prisma.timePeriod.create({ data: { periodName: "Monthly" } }),
    prisma.timePeriod.create({ data: { periodName: "Quarterly" } }),
    prisma.timePeriod.create({ data: { periodName: "Yearly" } }),
    prisma.timePeriod.create({ data: { periodName: "6 Months" } }),
  ]);
  console.log(`✅ Created ${timePeriods.length} time periods`);

  // --- Customer Categories ---
  const categories = await Promise.all([
    prisma.customerCategory.create({ data: { categoryName: "Renewal Customer" } }),
    prisma.customerCategory.create({ data: { categoryName: "Non Renewal Customer" } }),
  ]);
  console.log(`✅ Created ${categories.length} customer categories`);

  // ============================================================
  // FAP Control Data — 48 records with WIDE variation
  // ============================================================

  const peakTimes = ["7AM", "8AM", "10AM", "12PM", "2PM", "5PM", "7PM", "8PM", "9PM", "10PM"];

  // Service profiles — very different bases so services look distinct in charts
  const serviceProfiles = {
    Data:             { activeBase: 3200, revenueBase: 480000, dataBase: 980, callBase: 0,     occBase: 82 },
    "Voice Pack":     { activeBase: 1800, revenueBase: 210000, dataBase: 60,  callBase: 28000, occBase: 55 },
    IPTV:             { activeBase: 750,  revenueBase: 340000, dataBase: 650, callBase: 0,     occBase: 68 },
    "New Connection": { activeBase: 420,  revenueBase: 95000,  dataBase: 120, callBase: 3500,  occBase: 35 },
  };

  // Region multipliers — much wider spread so regions look different
  const regionMultipliers = {
    "NT Kirtipur": 1.55,   // biggest, urban hub
    "NT Balambu":  1.0,    // medium baseline
    "NT Dhading":  0.45,   // smaller, rural
  };

  // Time period multipliers — accumulative; bigger gap between Monthly vs Yearly
  const periodMultipliers = {
    Monthly:     1.0,
    Quarterly:   3.2,
    "6 Months":  6.8,
    Yearly:     14.0,
  };

  // Category split — heavy skew so renewal vs non-renewal gives very different numbers
  const categoryRatios = {
    "Renewal Customer":     { activeRatio: 0.82, nonRenewalRatio: 0.05 },
    "Non Renewal Customer": { activeRatio: 0.18, nonRenewalRatio: 0.78 },
  };

  // Per-region occupancy overrides for more interesting patterns
  const regionOccBoost = {
    "NT Kirtipur": 1.15,   // urban → higher occupancy
    "NT Balambu":  0.95,
    "NT Dhading":  0.70,   // rural → much lower occupancy
  };

  const fapRecords = [];
  let recordCount = 0;

  for (const region of regions) {
    const rm = regionMultipliers[region.regionName];
    const ob = regionOccBoost[region.regionName];

    for (const service of services) {
      const sp = serviceProfiles[service.serviceName];

      for (const period of timePeriods) {
        const pm = periodMultipliers[period.periodName];

        for (const category of categories) {
          const cr = categoryRatios[category.categoryName];

          // ±20% jitter for organic feel while keeping clear differences
          const jitter = () => 0.80 + Math.random() * 0.40;

          const activeUsers     = Math.round(sp.activeBase * rm * cr.activeRatio * jitter());
          const nonRenewalUsers = Math.round(sp.activeBase * rm * cr.nonRenewalRatio * jitter());
          const revenue         = Math.round(sp.revenueBase * rm * pm * cr.activeRatio * jitter());
          const occupancy       = Math.min(98, Math.round((sp.occBase * ob * jitter()) * 10) / 10);
          const dataUsage       = Math.round(sp.dataBase * rm * pm * jitter());
          const callVolume      = Math.round(sp.callBase * rm * pm * jitter());
          const peakUsageTime   = peakTimes[Math.floor(Math.random() * peakTimes.length)];

          fapRecords.push({
            regionId: region.id,
            serviceId: service.id,
            timePeriodId: period.id,
            categoryId: category.id,
            activeUsers,
            nonRenewalUsers,
            revenue,
            occupancyPercentage: occupancy,
            dataUsage,
            callVolume,
            peakUsageTime,
          });
          recordCount++;
        }
      }
    }
  }

  await prisma.fapControlData.createMany({ data: fapRecords });
  console.log(`✅ Created ${recordCount} FAP control data records`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
