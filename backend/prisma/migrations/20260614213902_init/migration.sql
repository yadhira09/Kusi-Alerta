-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'OPERATOR', 'SERENO', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'OBSERVED');

-- CreateEnum
CREATE TYPE "SerenoAvailability" AS ENUM ('DISPONIBLE', 'EN_ATENCION', 'FUERA_SERVICIO');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('PENDIENTE', 'RECIBIDO', 'ASIGNADO', 'EN_DESPLIEGUE', 'EN_INTERVENCION', 'ATENDIDO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateEnum
CREATE TYPE "ResponsibleRole" AS ENUM ('CITIZEN', 'OPERATOR', 'SERENO', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "RejectedAction" AS ENUM ('NONE', 'WARNING_GENERATED', 'ACCOUNT_OBSERVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sereno" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availability" "SerenoAvailability" NOT NULL DEFAULT 'DISPONIBLE',
    "currentZone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sereno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "locationText" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "evidenceText" TEXT,
    "status" "AlertStatus" NOT NULL DEFAULT 'PENDIENTE',
    "priority" "Priority" NOT NULL,
    "assignedSerenoId" TEXT,
    "rejectionReason" TEXT,
    "receivedAt" TIMESTAMP(3),
    "assignedAt" TIMESTAMP(3),
    "deploymentAt" TIMESTAMP(3),
    "interventionAt" TIMESTAMP(3),
    "attendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertHistory" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "status" "AlertStatus" NOT NULL,
    "responsibleRole" "ResponsibleRole" NOT NULL,
    "responsibleName" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseClosure" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedReportControl" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "action" "RejectedAction" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RejectedReportControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sereno_userId_key" ON "Sereno"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_code_key" ON "Alert"("code");

-- CreateIndex
CREATE INDEX "Alert_citizenId_idx" ON "Alert"("citizenId");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Alert_priority_idx" ON "Alert"("priority");

-- CreateIndex
CREATE INDEX "Alert_assignedSerenoId_idx" ON "Alert"("assignedSerenoId");

-- CreateIndex
CREATE INDEX "AlertHistory_alertId_idx" ON "AlertHistory"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseClosure_alertId_key" ON "CaseClosure"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_alertId_key" ON "Rating"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "RejectedReportControl_alertId_key" ON "RejectedReportControl"("alertId");

-- CreateIndex
CREATE INDEX "RejectedReportControl_citizenId_idx" ON "RejectedReportControl"("citizenId");

-- AddForeignKey
ALTER TABLE "Sereno" ADD CONSTRAINT "Sereno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedSerenoId_fkey" FOREIGN KEY ("assignedSerenoId") REFERENCES "Sereno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseClosure" ADD CONSTRAINT "CaseClosure_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedReportControl" ADD CONSTRAINT "RejectedReportControl_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedReportControl" ADD CONSTRAINT "RejectedReportControl_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
