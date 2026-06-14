import { AlertStatus, Priority, RejectedAction, ResponsibleRole, SerenoAvailability, UserRole, UserStatus } from "./enums";

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

export interface CaseClosureDto {
  id: string;
  alertId: string;
  activity: string;
  observations: string;
  recommendations: string;
  result: string;
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
  closure?: CaseClosureDto | null;
}

export interface DashboardSummaryDto {
  counts: Record<string, number>;
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
