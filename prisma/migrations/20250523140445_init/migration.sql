-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "daily_task_checker";

-- CreateTable
CREATE TABLE "daily_task_checker"."devices" (
    "deviceId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "daily_task_checker"."task_status_logs" (
    "logId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "task_status_logs_pkey" PRIMARY KEY ("logId")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_deviceId_key" ON "daily_task_checker"."devices"("deviceId");

-- AddForeignKey
ALTER TABLE "daily_task_checker"."task_status_logs" ADD CONSTRAINT "task_status_logs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "daily_task_checker"."devices"("deviceId") ON DELETE CASCADE ON UPDATE CASCADE;
