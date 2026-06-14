export type UserRole = "CITIZEN" | "OPERATOR" | "SERENO" | "ADMIN";
export type UserStatus = "ACTIVE" | "OBSERVED";
export type SerenoAvailability = "DISPONIBLE" | "EN_ATENCION" | "FUERA_SERVICIO";
export type AlertStatus = "PENDIENTE" | "RECIBIDO" | "ASIGNADO" | "EN_DESPLIEGUE" | "EN_INTERVENCION" | "ATENDIDO" | "RECHAZADO";
export type Priority = "ALTA" | "MEDIA" | "BAJA";

export interface UserDto {
  id: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  status: UserStatus;
  createdAt: string;
}

export interface SerenoDto {
  id: string;
  userId: string;
  name: string;
  availability: SerenoAvailability;
  currentZone: string;
  createdAt: string;
}

export interface AlertHistoryDto {
  id: string;
  alertId: string;
  status: AlertStatus;
  responsibleRole: string;
  responsibleName: string;
  observation: string;
  createdAt: string;
}

export interface AlertDto {
  id: string;
  code: string;
  citizenId: string;
  citizen?: UserDto;
  type: string;
  description?: string | null;
  locationText: string;
  reference: string;
  evidenceText?: string | null;
  status: AlertStatus;
  priority: Priority;
  assignedSerenoId?: string | null;
  assignedSereno?: SerenoDto | null;
  rejectionReason?: string | null;
  receivedAt?: string | null;
  assignedAt?: string | null;
  deploymentAt?: string | null;
  interventionAt?: string | null;
  attendedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  histories?: AlertHistoryDto[];
  rating?: { stars: number; comment?: string | null } | null;
  closure?: { activity: string; observations: string; recommendations: string; result: string } | null;
}
