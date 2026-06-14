import type { AlertDto } from "../types";
import { formatDate, statusFlow, statusLabels } from "../utils/labels";

export function AlertTimeline({ alert }: { alert: AlertDto }) {
  const reached = new Set(alert.histories?.map((history) => history.status) ?? [alert.status]);
  return (
    <ol className="timeline" aria-label="Línea de tiempo de estados">
      {statusFlow.map((status) => {
        const active = reached.has(status) || alert.status === status;
        const history = alert.histories?.find((item) => item.status === status);
        return (
          <li key={status} className={active ? "done" : "pending"}>
            <strong>{statusLabels[status]}</strong>
            <span>{history?.observation || "Pendiente de actualización"}</span>
            <small>{history ? formatDate(history.createdAt) : "Sin fecha"}</small>
          </li>
        );
      })}
      {alert.status === "RECHAZADO" ? (
        <li className="rejected">
          <strong>Rechazado</strong>
          <span>{alert.rejectionReason || "Reporte rechazado por operador"}</span>
        </li>
      ) : null}
    </ol>
  );
}
