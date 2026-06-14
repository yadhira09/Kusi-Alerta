import { prisma } from "../prisma";

export async function generateKusiCode(): Promise<string> {
  const alerts = await prisma.alert.findMany({ select: { code: true } });
  const used = new Set(
    alerts
      .map((alert) => Number(alert.code.replace("KUSI-", "")))
      .filter((value) => Number.isFinite(value))
  );

  let next = 1;
  while (used.has(next)) next += 1;
  return `KUSI-${String(next).padStart(4, "0")}`;
}
