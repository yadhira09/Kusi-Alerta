import type { AlertStatus, Priority } from "../types";
import { statusLabels } from "../utils/labels";

export function StatusBadge({ status }: { status: AlertStatus }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`badge priority-${priority.toLowerCase()}`}>Prioridad {priority}</span>;
}
