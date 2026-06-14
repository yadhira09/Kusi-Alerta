export enum UserRole {
  CITIZEN = "CITIZEN",
  OPERATOR = "OPERATOR",
  SERENO = "SERENO",
  ADMIN = "ADMIN"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  OBSERVED = "OBSERVED"
}

export enum SerenoAvailability {
  DISPONIBLE = "DISPONIBLE",
  EN_ATENCION = "EN_ATENCION",
  FUERA_SERVICIO = "FUERA_SERVICIO"
}

export enum AlertStatus {
  PENDIENTE = "PENDIENTE",
  RECIBIDO = "RECIBIDO",
  ASIGNADO = "ASIGNADO",
  EN_DESPLIEGUE = "EN_DESPLIEGUE",
  EN_INTERVENCION = "EN_INTERVENCION",
  ATENDIDO = "ATENDIDO",
  RECHAZADO = "RECHAZADO"
}

export enum Priority {
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAJA = "BAJA"
}

export enum ResponsibleRole {
  CITIZEN = "CITIZEN",
  OPERATOR = "OPERATOR",
  SERENO = "SERENO",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM"
}

export enum RejectedAction {
  NONE = "NONE",
  WARNING_GENERATED = "WARNING_GENERATED",
  ACCOUNT_OBSERVED = "ACCOUNT_OBSERVED"
}

export const statusLabels: Record<AlertStatus, string> = {
  [AlertStatus.PENDIENTE]: "Pendiente",
  [AlertStatus.RECIBIDO]: "Recibida por Central",
  [AlertStatus.ASIGNADO]: "Asignado",
  [AlertStatus.EN_DESPLIEGUE]: "En despliegue",
  [AlertStatus.EN_INTERVENCION]: "En intervención",
  [AlertStatus.ATENDIDO]: "Atendido",
  [AlertStatus.RECHAZADO]: "Rechazado"
};

export const statusFlow: AlertStatus[] = [
  AlertStatus.PENDIENTE,
  AlertStatus.RECIBIDO,
  AlertStatus.ASIGNADO,
  AlertStatus.EN_DESPLIEGUE,
  AlertStatus.EN_INTERVENCION,
  AlertStatus.ATENDIDO
];
