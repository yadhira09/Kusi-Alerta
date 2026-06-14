import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AlertDto, AlertStatus, DashboardSummaryDto } from "../../types";
import { getAlerts, getDashboardSummary } from "../../services/api";
import { createPanelSocket } from "../../services/socket";
import { MetricCard } from "../../components/MetricCard";
import { PriorityBadge, StatusBadge } from "../../components/StatusBadge";
import { TimerText } from "../../components/TimerText";
import { formatDate, statusLabels } from "../../utils/labels";

const statusOptions: (AlertStatus | "")[] = ["", "PENDIENTE", "RECIBIDO", "ASIGNADO", "EN_DESPLIEGUE", "EN_INTERVENCION", "ATENDIDO", "RECHAZADO"];

export function OperatorDashboard() {
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [status, setStatus] = useState<AlertStatus | "">("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [liveMessage, setLiveMessage] = useState("Panel listo para recibir alertas.");

  const load = useCallback(async () => {
    const [alertData, summaryData] = await Promise.all([
      getAlerts({ status: status || undefined, priority: priority || undefined, search: search || undefined }),
      getDashboardSummary()
    ]);
    setAlerts(alertData);
    setSummary(summaryData);
  }, [status, priority, search]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const socket = createPanelSocket("operator");
    const onUpdate = (alert: AlertDto) => {
      setLiveMessage(`Nueva actualización recibida: ${alert.code} - ${statusLabels[alert.status]}`);
      void load();
    };
    socket.on("alert_created", onUpdate);
    socket.on("alert_updated", onUpdate);
    return () => socket.disconnect();
  }, [load]);

  const newest = useMemo(() => alerts.slice(0, 8), [alerts]);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Central de Operaciones</p>
          <h1>Panel operador</h1>
          <p>Recepción, validación, rechazo y asignación con semáforo operativo.</p>
        </div>
        <Link className="button secondary" to="/admin">Ver administrador</Link>
      </header>

      <p className="sr-live" aria-live="polite">{liveMessage}</p>

      <section className="metrics-grid" aria-label="Resumen de alertas del operador">
        <MetricCard title="Pendientes" value={summary?.counts.PENDIENTE ?? 0} />
        <MetricCard title="Recibidas" value={summary?.counts.RECIBIDO ?? 0} />
        <MetricCard title="Asignadas" value={summary?.counts.ASIGNADO ?? 0} />
        <MetricCard title="En despliegue" value={summary?.counts.EN_DESPLIEGUE ?? 0} />
        <MetricCard title="En intervención" value={summary?.counts.EN_INTERVENCION ?? 0} />
        <MetricCard title="Atendidas" value={summary?.counts.ATENDIDO ?? 0} />
        <MetricCard title="Rechazadas" value={summary?.counts.RECHAZADO ?? 0} />
        <MetricCard title="Promedio simulado" value={`${summary?.averageAttentionMinutes ?? 0} min`} helper="hasta atención" />
      </section>

      <section className="panel-card">
        <div className="section-title">
          <div>
            <h2>Lista de alertas</h2>
            <p>Filtra por estado, prioridad o código KUSI.</p>
          </div>
        </div>
        <form className="filters" onSubmit={(event) => event.preventDefault()}>
          <label>
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value as AlertStatus | "")}>
              {statusOptions.map((item) => <option key={item || "todos"} value={item}>{item ? statusLabels[item] : "Todos"}</option>)}
            </select>
          </label>
          <label>
            Prioridad
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="">Todas</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </label>
          <label>
            Búsqueda
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="KUSI-0001, tipo, referencia..." />
          </label>
          <button type="button" onClick={() => void load()}>Actualizar</button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código KUSI</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Ciudadano ficticio</th>
                <th>Tiempo</th>
                <th>Fecha</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {newest.map((alert) => (
                <tr key={alert.id}>
                  <td><strong>{alert.code}</strong></td>
                  <td>{alert.type}</td>
                  <td><StatusBadge status={alert.status} /></td>
                  <td><PriorityBadge priority={alert.priority} /></td>
                  <td>{alert.citizen?.name || "Ciudadano demo"}</td>
                  <td><TimerText from={alert.createdAt} label="Espera" /></td>
                  <td>{formatDate(alert.createdAt)}</td>
                  <td><Link className="table-link" to={`/operator/alerts/${alert.id}`}>Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel-card">
        <h2>Alertas con mayor tiempo de espera</h2>
        <div className="compact-list">
          {summary?.longestWaitingAlerts?.map((alert) => (
            <Link key={alert.id} to={`/operator/alerts/${alert.id}`}>
              <strong>{alert.code}</strong>
              <span>{alert.type}</span>
              <TimerText from={alert.createdAt} label="Tiempo" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
