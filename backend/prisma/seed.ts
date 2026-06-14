import { PrismaClient, AlertStatus, Priority, ResponsibleRole, SerenoAvailability, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.rating.deleteMany();
  await prisma.caseClosure.deleteMany();
  await prisma.rejectedReportControl.deleteMany();
  await prisma.alertHistory.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.sereno.deleteMany();
  await prisma.user.deleteMany();

  const rosa = await prisma.user.create({ data: { name: "Rosa Quispe", role: UserRole.CITIZEN, phone: "999 000 001" } });
  await prisma.user.create({ data: { name: "Carmen Flores", role: UserRole.OPERATOR, phone: "999 000 002" } });
  const luisUser = await prisma.user.create({ data: { name: "Luis Mamani", role: UserRole.SERENO, phone: "999 000 003" } });
  const juanUser = await prisma.user.create({ data: { name: "Juan Condori", role: UserRole.SERENO, phone: "999 000 004" } });
  const pedroUser = await prisma.user.create({ data: { name: "Pedro Apaza", role: UserRole.SERENO, phone: "999 000 005" } });
  await prisma.user.create({ data: { name: "Admin MDCGAL", role: UserRole.ADMIN, phone: "999 000 006" } });

  const luis = await prisma.sereno.create({ data: { userId: luisUser.id, name: "Sereno 01 - Luis Mamani", availability: SerenoAvailability.DISPONIBLE, currentZone: "Mercado Santa Rosa - cuadrante norte" } });
  await prisma.sereno.create({ data: { userId: juanUser.id, name: "Sereno 02 - Juan Condori", availability: SerenoAvailability.DISPONIBLE, currentZone: "Mercado Santa Rosa - cuadrante este" } });
  const pedro = await prisma.sereno.create({ data: { userId: pedroUser.id, name: "Sereno 03 - Pedro Apaza", availability: SerenoAvailability.EN_ATENCION, currentZone: "Mercado Santa Rosa - cuadrante sur" } });

  const now = new Date();
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);

  const alert1 = await prisma.alert.create({
    data: {
      code: "KUSI-0101",
      citizenId: rosa.id,
      type: "Consumo de alcohol en vía pública",
      description: "Grupo de personas consumiendo alcohol y ocupando parte de la vereda cerca del mercado.",
      locationText: "Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna",
      reference: "Frente a una tienda, cerca de una esquina del mercado",
      evidenceText: "Evidencia simulada cargada",
      status: AlertStatus.ATENDIDO,
      priority: Priority.ALTA,
      assignedSerenoId: luis.id,
      receivedAt: minutesAgo(50),
      assignedAt: minutesAgo(45),
      deploymentAt: minutesAgo(40),
      interventionAt: minutesAgo(32),
      attendedAt: minutesAgo(20),
      createdAt: minutesAgo(55),
      histories: {
        create: [
          { status: AlertStatus.PENDIENTE, responsibleRole: ResponsibleRole.CITIZEN, responsibleName: "Rosa Quispe", observation: "Alerta generada desde Kusi Rápido." , createdAt: minutesAgo(55)},
          { status: AlertStatus.RECIBIDO, responsibleRole: ResponsibleRole.OPERATOR, responsibleName: "Carmen Flores", observation: "Tu alerta fue recibida por Central." , createdAt: minutesAgo(50)},
          { status: AlertStatus.ASIGNADO, responsibleRole: ResponsibleRole.OPERATOR, responsibleName: "Carmen Flores", observation: "Sereno asignado: Luis Mamani." , createdAt: minutesAgo(45)},
          { status: AlertStatus.EN_DESPLIEGUE, responsibleRole: ResponsibleRole.SERENO, responsibleName: "Luis Mamani", observation: "Sereno en camino." , createdAt: minutesAgo(40)},
          { status: AlertStatus.EN_INTERVENCION, responsibleRole: ResponsibleRole.SERENO, responsibleName: "Luis Mamani", observation: "El equipo llegó a la zona." , createdAt: minutesAgo(32)},
          { status: AlertStatus.ATENDIDO, responsibleRole: ResponsibleRole.SERENO, responsibleName: "Luis Mamani", observation: "Caso atendido." , createdAt: minutesAgo(20)}
        ]
      }
    }
  });

  await prisma.caseClosure.create({ data: { alertId: alert1.id, activity: "Orientación preventiva y retiro del grupo de la vía pública.", observations: "La situación fue controlada sin confrontación.", recommendations: "Mantener patrullaje preventivo alrededor del mercado.", result: "Atendido sin novedad adicional." } });
  await prisma.rating.create({ data: { alertId: alert1.id, stars: 5, comment: "Gracias por atender rápido." } });

  await prisma.alert.create({
    data: {
      code: "KUSI-0102",
      citizenId: rosa.id,
      type: "Ruido excesivo",
      description: "Música alta desde un grupo cercano al mercado.",
      locationText: "Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna",
      reference: "Al costado del mercado, referencia de bodega cercana",
      evidenceText: "Sin evidencia por seguridad",
      status: AlertStatus.EN_INTERVENCION,
      priority: Priority.MEDIA,
      assignedSerenoId: pedro.id,
      receivedAt: minutesAgo(25),
      assignedAt: minutesAgo(20),
      deploymentAt: minutesAgo(15),
      interventionAt: minutesAgo(8),
      createdAt: minutesAgo(30),
      histories: {
        create: [
          { status: AlertStatus.PENDIENTE, responsibleRole: ResponsibleRole.CITIZEN, responsibleName: "Rosa Quispe", observation: "Alerta generada." , createdAt: minutesAgo(30)},
          { status: AlertStatus.RECIBIDO, responsibleRole: ResponsibleRole.OPERATOR, responsibleName: "Carmen Flores", observation: "Reporte recibido." , createdAt: minutesAgo(25)},
          { status: AlertStatus.ASIGNADO, responsibleRole: ResponsibleRole.OPERATOR, responsibleName: "Carmen Flores", observation: "Sereno asignado: Pedro Apaza." , createdAt: minutesAgo(20)},
          { status: AlertStatus.EN_DESPLIEGUE, responsibleRole: ResponsibleRole.SERENO, responsibleName: "Pedro Apaza", observation: "Sereno en camino." , createdAt: minutesAgo(15)},
          { status: AlertStatus.EN_INTERVENCION, responsibleRole: ResponsibleRole.SERENO, responsibleName: "Pedro Apaza", observation: "El equipo llegó a la zona." , createdAt: minutesAgo(8)}
        ]
      }
    }
  });

  const rejected = await prisma.alert.create({
    data: {
      code: "KUSI-0103",
      citizenId: rosa.id,
      type: "Otro",
      description: "Reporte sin información suficiente.",
      locationText: "Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna",
      reference: "Referencia incompleta",
      evidenceText: null,
      status: AlertStatus.RECHAZADO,
      priority: Priority.BAJA,
      rejectionReason: "Información insuficiente",
      createdAt: minutesAgo(90),
      histories: {
        create: [
          { status: AlertStatus.PENDIENTE, responsibleRole: ResponsibleRole.CITIZEN, responsibleName: "Rosa Quispe", observation: "Alerta generada." , createdAt: minutesAgo(90)},
          { status: AlertStatus.RECHAZADO, responsibleRole: ResponsibleRole.OPERATOR, responsibleName: "Carmen Flores", observation: "Reporte rechazado por información insuficiente." , createdAt: minutesAgo(85)}
        ]
      }
    }
  });

  await prisma.rejectedReportControl.create({ data: { citizenId: rosa.id, alertId: rejected.id, reason: "Información insuficiente", action: "NONE" } });

  console.log("Seed KusiAlerta completado con datos ficticios.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
