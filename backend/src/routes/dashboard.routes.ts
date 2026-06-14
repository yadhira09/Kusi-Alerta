import { Router } from "express";
import { AlertStatus, SerenoAvailability } from "@prisma/client";
import { prisma } from "../prisma";
import { alertInclude } from "../utils/include";
import { average, minutesBetween } from "../utils/time";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard/summary", async (_req, res, next) => {
  try {
    const [alerts, serenos, rejectedControls] = await Promise.all([
      prisma.alert.findMany({ include: alertInclude, orderBy: { createdAt: "desc" } }),
      prisma.sereno.findMany(),
      prisma.rejectedReportControl.findMany({ include: { citizen: true, alert: true }, orderBy: { createdAt: "desc" } })
    ]);

    const counts = Object.fromEntries(Object.values(AlertStatus).map((status) => [status, alerts.filter((alert) => alert.status === status).length]));
    const attended = alerts.filter((alert) => alert.status === AlertStatus.ATENDIDO && alert.attendedAt);
    const attentionTimes = attended.map((alert) => minutesBetween(alert.createdAt, alert.attendedAt));
    const ratings = alerts.map((alert) => alert.rating).filter(Boolean) as { stars: number }[];
    const fullTrackingCount = alerts.filter((alert) => alert.receivedAt && alert.assignedAt && alert.deploymentAt && alert.interventionAt && alert.attendedAt).length;
    const incidentsByType = Object.entries(
      alerts.reduce<Record<string, number>>((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {})
    ).map(([type, count]) => ({ type, count }));

    const waitingStatuses = [AlertStatus.PENDIENTE, AlertStatus.RECIBIDO, AlertStatus.ASIGNADO, AlertStatus.EN_DESPLIEGUE, AlertStatus.EN_INTERVENCION];
    const longestWaitingAlerts = alerts
      .filter((alert) => waitingStatuses.includes(alert.status))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, 5);

    res.json({
      counts,
      totalAlerts: alerts.length,
      averageAttentionMinutes: average(attentionTimes),
      serenosAvailable: serenos.filter((sereno) => sereno.availability === SerenoAvailability.DISPONIBLE).length,
      serenosBusy: serenos.filter((sereno) => sereno.availability === SerenoAvailability.EN_ATENCION).length,
      fullTrackingCount,
      ratedCases: ratings.length,
      satisfactionAverage: ratings.length ? Number((ratings.reduce((acc, rating) => acc + rating.stars, 0) / ratings.length).toFixed(1)) : 0,
      attendedPercentage: alerts.length ? Math.round(((counts[AlertStatus.ATENDIDO] || 0) / alerts.length) * 100) : 0,
      rejectedPercentage: alerts.length ? Math.round(((counts[AlertStatus.RECHAZADO] || 0) / alerts.length) * 100) : 0,
      incidentsByType,
      rejectedControls,
      longestWaitingAlerts
    });
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/rejected-control/:citizenId", async (req, res, next) => {
  try {
    const controls = await prisma.rejectedReportControl.findMany({
      where: { citizenId: req.params.citizenId },
      include: { citizen: true, alert: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(controls);
  } catch (error) {
    next(error);
  }
});
