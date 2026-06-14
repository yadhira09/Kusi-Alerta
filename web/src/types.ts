export type UserRole = "CITIZEN" | "OPERATOR" | "SERENO" | "ADMIN";
export type UserStatus = "ACTIVE" | "OBSERVED";
export type SerenoAvailability = "DISPONIBLE" | "EN_ATENCION" | "FUERA_SERVICIO";
export type AlertStatus = "PENDIENTE" | "RECIBIDO" | "ASIGNADO" | "EN_DESPLIEGUE" | "EN_INTERVENCION" | "ATENDIDO" | "RECHAZADO";
export type Priority = "ALTA" | "MEDIA" | "BAJA";
export type ResponsibleRole = "CITIZEN" | "OPERATOR" | "SERENO" | "ADMIN" | "SYSTEM";
export type RejectedAction = "NONE" | "WARNING_GENERATED" | "ACCOUNT_OBSERVED";

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
  responsibleRole: ResponsibleRole;
  responsibleName: string;
  observation: string;
  createdAt: string;
}

export interface RatingDto {
  id: string;
  alertId: string;
  stars: number;
  comment?: string | null;
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
  latitude?: number | null;
  longitude?: number | null;
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
  rating?: RatingDto | null;
  closure?: {
    activity: string;
    observations: string;
    recommendations: string;
    result: string;
    createdAt: string;
  } | null;
}

export interface DashboardSummaryDto {
  counts: Record<AlertStatus, number>;
  totalAlerts: number;
  averageAttentionMinutes: number;
  serenosAvailable: number;
  serenosBusy: number;
  fullTrackingCount: number;
  ratedCases: number;
  satisfactionAverage: number;
  attendedPercentage: number;
  rejectedPercentage: number;
  incidentsByType: { type: string; count: number }[];
  rejectedControls: RejectedControlDto[];
  longestWaitingAlerts: AlertDto[];
}

export interface RejectedControlDto {
  id: string;
  citizenId: string;
  alertId: string;
  reason: string;
  action: RejectedAction;
  createdAt: string;
  citizen?: UserDto;
  alert?: AlertDto;
}
