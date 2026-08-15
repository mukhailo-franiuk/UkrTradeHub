-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL DEFAULT 'system_core_config',
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "welcomeBonus" DOUBLE PRECISION NOT NULL DEFAULT 150.0,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);
