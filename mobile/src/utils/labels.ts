import type { AlertStatus, SerenoAvailability } from "../types";

export const statusLabels: Record<AlertStatus, string> = {
  PENDIENTE: "Pendiente",
  RECIBIDO: "Recibida por Central",
  ASIGNADO: "Asignado",
  EN_DESPLIEGUE: "En despliegue",
  EN_INTERVENCION: "En intervención",
  ATENDIDO: "Atendido",
  RECHAZADO: "Rechazado"
};

export const statusMessages: Record<AlertStatus, string> = {
  PENDIENTE: "La Central de Operaciones está revisando tu reporte.",
  RECIBIDO: "Tu alerta fue recibida por Central.",
  ASIGNADO: "Un sereno fue asignado.",
  EN_DESPLIEGUE: "Sereno en camino.",
  EN_INTERVENCION: "El equipo llegó a la zona.",
  ATENDIDO: "Caso atendido.",
  RECHAZADO: "Tu alerta fue revisada y rechazada por Central."
};

export const statusFlow: AlertStatus[] = ["PENDIENTE", "RECIBIDO", "ASIGNADO", "EN_DESPLIEGUE", "EN_INTERVENCION", "ATENDIDO"];

export const availabilityLabels: Record<SerenoAvailability, string> = {
  DISPONIBLE: "Disponible",
  EN_ATENCION: "En atención",
  FUERA_SERVICIO: "Fuera de servicio"
};

export function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function elapsedLabel(value?: string | null) {
  if (!value) return "Sin registro";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "menos de 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
