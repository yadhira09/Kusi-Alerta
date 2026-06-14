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

export const statusFlow: AlertStatus[] = ["PENDIENTE", "RECIBIDO", "ASIGNADO", "EN_DESPLIEGUE", "EN_INTERVENCION", "ATENDIDO"];

export const availabilityLabels: Record<SerenoAvailability, string> = {
  DISPONIBLE: "Disponible",
  EN_ATENCION: "En atención",
  FUERA_SERVICIO: "Fuera de servicio"
};

export function formatDate(value?: string | null) {
  if (!value) return "Sin registro";
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function elapsedLabel(value?: string | null) {
  if (!value) return "Sin registro";
  const ms = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return "menos de 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} h ${rest} min`;
}

export function durationBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return "En proceso";
  const minutes = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
