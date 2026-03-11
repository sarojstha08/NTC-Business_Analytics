-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ANALYST');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "region_name" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_periods" (
    "id" SERIAL NOT NULL,
    "period_name" TEXT NOT NULL,

    CONSTRAINT "time_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_categories" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "customer_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fap_control_data" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "time_period_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "active_users" INTEGER NOT NULL,
    "non_renewal_users" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "occupancy_percentage" DOUBLE PRECISION NOT NULL,
    "data_usage" DOUBLE PRECISION NOT NULL,
    "call_volume" INTEGER NOT NULL,
    "peak_usage_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fap_control_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "regions_region_name_key" ON "regions"("region_name");

-- CreateIndex
CREATE UNIQUE INDEX "services_service_name_key" ON "services"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "time_periods_period_name_key" ON "time_periods"("period_name");

-- CreateIndex
CREATE UNIQUE INDEX "customer_categories_category_name_key" ON "customer_categories"("category_name");

-- AddForeignKey
ALTER TABLE "fap_control_data" ADD CONSTRAINT "fap_control_data_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fap_control_data" ADD CONSTRAINT "fap_control_data_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fap_control_data" ADD CONSTRAINT "fap_control_data_time_period_id_fkey" FOREIGN KEY ("time_period_id") REFERENCES "time_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fap_control_data" ADD CONSTRAINT "fap_control_data_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "customer_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
