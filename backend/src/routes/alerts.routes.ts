import { Router } from "express";
import { AlertStatus, Priority, RejectedAction, ResponsibleRole, SerenoAvailability, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma";
import { emitAlertEvent } from "../socket/socket";
import { generateKusiCode } from "../utils/code";
import { alertInclude } from "../utils/include";
import { calculatePriority } from "../utils/priority";

export const alertsRouter = Router();

const createAlertSchema = z.object({
  citizenId: z.string().optional(),
  type: z.string().min(3),
  description: z.string().optional().default(""),
  locationText: z.string().min(3).default("Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna"),
  reference: z.string().min(3),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  evidenceText: z.string().optional().default("")
});

async function getDemoCitizenId(citizenId?: string) {
  if (citizenId) return citizenId;
  const citizen = await prisma.user.findFirst({ where: { role: UserRole.CITIZEN }, orderBy: { createdAt: "asc" } });
  if (!citizen) {
    const error = new Error("No existe ciudadano demo. Ejecuta npx prisma db seed.");
    (error as { status?: number }).status = 400;
    throw error;
  }
  return citizen.id;
}

function timestampForStatus(status: AlertStatus) {
  const now = new Date();
  if (status === AlertStatus.RECIBIDO) return { receivedAt: now };
  if (status === AlertStatus.ASIGNADO) return { assignedAt: now };
  if (status === AlertStatus.EN_DESPLIEGUE) return { deploymentAt: now };
  if (status === AlertStatus.EN_INTERVENCION) return { interventionAt: now };
  if (status === AlertStatus.ATENDIDO) return { attendedAt: now };
  return {};
}

function eventForStatus(status: AlertStatus) {
  if (status === AlertStatus.RECIBIDO) return "alert_received";
  if (status === AlertStatus.ASIGNADO) return "alert_assigned";
  if (status === AlertStatus.EN_DESPLIEGUE) return "alert_deployment";
  if (status === AlertStatus.EN_INTERVENCION) return "alert_intervention";
  if (status === AlertStatus.ATENDIDO) return "alert_attended";
  if (status === AlertStatus.RECHAZADO) return "alert_rejected";
  return "alert_updated";
}

alertsRouter.get("/alerts", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const alerts = await prisma.alert.findMany({
      where: {
        ...(status ? { status: status as AlertStatus } : {}),
        ...(priority ? { priority: priority as Priority } : {}),
        ...(search
          ? {
              OR: [
                { code: { contains: search, mode: "insensitive" } },
                { type: { contains: search, mode: "insensitive" } },
                { reference: { contains: search, mode: "insensitive" } },
                { citizen: { name: { contains: search, mode: "insensitive" } } }
              ]
            }
          : {})
      },
      include: alertInclude,
      orderBy: { createdAt: "desc" }
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

alertsRouter.get("/alerts/:id", async (req, res, next) => {
  try {
    const alert = await prisma.alert.findUnique({ where: { id: req.params.id }, include: alertInclude });
    if (!alert) return res.status(404).json({ message: "Alerta no encontrada" });
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.post("/alerts", async (req, res, next) => {
  try {
    const data = createAlertSchema.parse(req.body);
    const citizenId = await getDemoCitizenId(data.citizenId);
    const code = await generateKusiCode();
    const priority = calculatePriority(data);

    const alert = await prisma.alert.create({
      data: {
        code,
        citizenId,
        type: data.type,
        description: data.description,
        locationText: data.locationText,
        reference: data.reference,
        latitude: data.latitude,
        longitude: data.longitude,
        evidenceText: data.evidenceText || null,
        status: AlertStatus.PENDIENTE,
        priority,
        histories: {
          create: {
            status: AlertStatus.PENDIENTE,
            responsibleRole: ResponsibleRole.CITIZEN,
            responsibleName: "Rosa Quispe",
            observation: "Alerta generada desde Kusi Rápido. Ubicación referencial: cinco cuadras alrededor del Mercado Santa Rosa."
          }
        }
      },
      include: alertInclude
    });

    emitAlertEvent("alert_created", alert);
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.patch("/alerts/:id/receive", async (req, res, next) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: {
        status: AlertStatus.RECIBIDO,
        receivedAt: new Date(),
        histories: {
          create: {
            status: AlertStatus.RECIBIDO,
            responsibleRole: ResponsibleRole.OPERATOR,
            responsibleName: req.body?.responsibleName || "Carmen Flores",
            observation: "Tu alerta fue recibida por Central. La Central de Operaciones está revisando tu reporte."
          }
        }
      },
      include: alertInclude
    });
    emitAlertEvent("alert_received", alert);
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.patch("/alerts/:id/assign", async (req, res, next) => {
  try {
    const schema = z.object({ serenoId: z.string(), responsibleName: z.string().optional() });
    const data = schema.parse(req.body);
    const sereno = await prisma.sereno.findUnique({ where: { id: data.serenoId } });
    if (!sereno) return res.status(404).json({ message: "Sereno no encontrado" });
    if (sereno.availability !== SerenoAvailability.DISPONIBLE) {
      return res.status(400).json({ message: "Solo se puede asignar a serenos disponibles" });
    }

    const alert = await prisma.$transaction(async (tx) => {
      await tx.sereno.update({ where: { id: data.serenoId }, data: { availability: SerenoAvailability.EN_ATENCION } });
      return tx.alert.update({
        where: { id: req.params.id },
        data: {
          status: AlertStatus.ASIGNADO,
          assignedSerenoId: data.serenoId,
          assignedAt: new Date(),
          histories: {
            create: {
              status: AlertStatus.ASIGNADO,
              responsibleRole: ResponsibleRole.OPERATOR,
              responsibleName: data.responsibleName || "Carmen Flores",
              observation: `Sereno asignado: ${sereno.name}.`
            }
          }
        },
        include: alertInclude
      });
    });

    emitAlertEvent("alert_assigned", alert);
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.patch("/alerts/:id/reject", async (req, res, next) => {
  try {
    const schema = z.object({ reason: z.string().min(3), responsibleName: z.string().optional() });
    const data = schema.parse(req.body);
    const current = await prisma.alert.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ message: "Alerta no encontrada" });

    const previousFalseAlarms = await prisma.rejectedReportControl.count({
      where: { citizenId: current.citizenId, reason: { contains: "Falsa alarma", mode: "insensitive" } }
    });
    const nextFalseAlarms = data.reason.includes("Falsa alarma") ? previousFalseAlarms + 1 : previousFalseAlarms;
    const action = nextFalseAlarms >= 3 ? RejectedAction.ACCOUNT_OBSERVED : nextFalseAlarms >= 2 ? RejectedAction.WARNING_GENERATED : RejectedAction.NONE;

    const alert = await prisma.$transaction(async (tx) => {
      const updated = await tx.alert.update({
        where: { id: req.params.id },
        data: {
          status: AlertStatus.RECHAZADO,
          rejectionReason: data.reason,
          histories: {
            create: {
              status: AlertStatus.RECHAZADO,
              responsibleRole: ResponsibleRole.OPERATOR,
              responsibleName: data.responsibleName || "Carmen Flores",
              observation: `Reporte rechazado: ${data.reason}`
            }
          }
        },
        include: alertInclude
      });
      await tx.rejectedReportControl.create({
        data: { citizenId: current.citizenId, alertId: current.id, reason: data.reason, action }
      });
      if (action === RejectedAction.ACCOUNT_OBSERVED) {
        await tx.user.update({ where: { id: current.citizenId }, data: { status: UserStatus.OBSERVED } });
      }
      return updated;
    });

    emitAlertEvent("alert_rejected", alert);
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.patch("/alerts/:id/status", async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.nativeEnum(AlertStatus),
      responsibleName: z.string().default("Luis Mamani"),
      responsibleRole: z.nativeEnum(ResponsibleRole).default(ResponsibleRole.SERENO),
      observation: z.string().optional()
    });
    const data = schema.parse(req.body);
    if (![AlertStatus.EN_DESPLIEGUE, AlertStatus.EN_INTERVENCION].includes(data.status)) {
      return res.status(400).json({ message: "Usa este endpoint solo para despliegue o intervención. Para cierre usa /close." });
    }

    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: {
        status: data.status,
        ...timestampForStatus(data.status),
        histories: {
          create: {
            status: data.status,
            responsibleRole: data.responsibleRole,
            responsibleName: data.responsibleName,
            observation: data.observation || (data.status === AlertStatus.EN_DESPLIEGUE ? "Sereno en camino." : "El equipo llegó a la zona e inició intervención.")
          }
        }
      },
      include: alertInclude
    });
    emitAlertEvent(eventForStatus(data.status), alert);
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.post("/alerts/:id/close", async (req, res, next) => {
  try {
    const schema = z.object({
      activity: z.string().min(3),
      observations: z.string().min(3),
      recommendations: z.string().min(3),
      result: z.string().min(3),
      responsibleName: z.string().default("Luis Mamani")
    });
    const data = schema.parse(req.body);
    const current = await prisma.alert.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ message: "Alerta no encontrada" });

    const alert = await prisma.$transaction(async (tx) => {
      await tx.caseClosure.upsert({
        where: { alertId: current.id },
        create: {
          alertId: current.id,
          activity: data.activity,
          observations: data.observations,
          recommendations: data.recommendations,
          result: data.result
        },
        update: {
          activity: data.activity,
          observations: data.observations,
          recommendations: data.recommendations,
          result: data.result
        }
      });
      if (current.assignedSerenoId) {
        await tx.sereno.update({ where: { id: current.assignedSerenoId }, data: { availability: SerenoAvailability.DISPONIBLE } });
      }
      return tx.alert.update({
        where: { id: current.id },
        data: {
          status: AlertStatus.ATENDIDO,
          attendedAt: new Date(),
          histories: {
            create: {
              status: AlertStatus.ATENDIDO,
              responsibleRole: ResponsibleRole.SERENO,
              responsibleName: data.responsibleName,
              observation: "Caso atendido. Se registró cierre operativo."
            }
          }
        },
        include: alertInclude
      });
    });
    emitAlertEvent("alert_attended", alert);
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

alertsRouter.post("/alerts/:id/rating", async (req, res, next) => {
  try {
    const schema = z.object({ stars: z.number().int().min(1).max(5), comment: z.string().optional() });
    const data = schema.parse(req.body);
    const rating = await prisma.rating.upsert({
      where: { alertId: req.params.id },
      create: { alertId: req.params.id, stars: data.stars, comment: data.comment || null },
      update: { stars: data.stars, comment: data.comment || null }
    });
    const alert = await prisma.alert.findUniqueOrThrow({ where: { id: req.params.id }, include: alertInclude });
    emitAlertEvent("alert_rated", alert);
    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
});

alertsRouter.get("/alerts/citizen/:citizenId/history", async (req, res, next) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { citizenId: req.params.citizenId },
      include: alertInclude,
      orderBy: { createdAt: "desc" }
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});
