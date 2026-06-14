import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AlertDto, DashboardSummaryDto } from "../../types";
import { getAlerts, getDashboardSummary } from "../../services/api";
import { createPanelSocket } from "../../services/socket";
import { MetricCard } from "../../components/MetricCard";
import { ReferenceMap } from "../../components/ReferenceMap";
import { StatusBadge } from "../../components/StatusBadge";
import { TraceTimes } from "../../components/TimerText";
import { formatDate } from "../../utils/labels";

export function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [liveMessage, setLiveMessage] = useState("Dashboard administrativo actualizado.");

  const load = useCallback(async () => {
    const [summaryData, alertData] = await Promise.all([getDashboardSummary(), getAlerts()]);
    setSummary(summaryData);
    setAlerts(alertData);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const socket = createPanelSocket("admin");
    socket.on("alert_updated", (alert: AlertDto) => {
      setLiveMessage(`Actualización administrativa: ${alert.code}`);
      void load();
    });
    return () => socket.disconnect();
  }, [load]);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <Link className="back-link" to="/operator">← Volver al operador</Link>
          <p className="eyebrow">Administrador MDCGAL</p>
          <h1>Dashboard general</h1>
          <p>Indicadores de confianza ciudadana, trazabilidad y reportes rechazados.</p>
        </div>
      </header>

      <p className="sr-live" aria-live="polite">{liveMessage}</p>

      <section className="metrics-grid" aria-label="Indicadores generales">
        <MetricCard title="Total alertas" value={summary?.totalAlerts ?? 0} />
        <MetricCard title="Pendientes" value={summary?.counts.PENDIENTE ?? 0} />
        <MetricCard title="Recibidas" value={summary?.counts.RECIBIDO ?? 0} />
        <MetricCard title="Asignadas" value={summary?.counts.ASIGNADO ?? 0} />
        <MetricCard title="En despliegue" value={summary?.counts.EN_DESPLIEGUE ?? 0} />
        <MetricCard title="En intervención" value={summary?.counts.EN_INTERVENCION ?? 0} />
        <MetricCard title="Atendidas" value={summary?.counts.ATENDIDO ?? 0} />
        <MetricCard title="Rechazadas" value={summary?.counts.RECHAZADO ?? 0} />
        <MetricCard title="Tiempo promedio" value={`${summary?.averageAttentionMinutes ?? 0} min`} />
        <MetricCard title="Serenos disponibles" value={summary?.serenosAvailable ?? 0} />
        <MetricCard title="Serenos en atención" value={summary?.serenosBusy ?? 0} />
      </section>

      <section className="panel-card">
        <h2>Indicadores de confianza ciudadana</h2>
        <div className="metrics-grid small">
          <MetricCard title="Seguimiento completo" value={summary?.fullTrackingCount ?? 0} helper="casos con todos los estados" />
          <MetricCard title="Casos calificados" value={summary?.ratedCases ?? 0} />
          <MetricCard title="Satisfacción promedio" value={`${summary?.satisfactionAverage ?? 0} / 5`} />
          <MetricCard title="Alertas atendidas" value={`${summary?.attendedPercentage ?? 0}%`} />
          <MetricCard title="Alertas rechazadas" value={`${summary?.rejectedPercentage ?? 0}%`} />
        </div>
      </section>

      <section className="detail-layout">
        <article className="panel-card">
          <h2>Zonas críticas simuladas</h2>
          <p><strong>Mercado Santa Rosa y alrededores.</strong> Radio aproximado: 5 cuadras.</p>
          <ul className="incident-list">
            {summary?.incidentsByType?.map((item) => <li key={item.type}><span>{item.type}</span><strong>{item.count}</strong></li>)}
          </ul>
        </article>
        <ReferenceMap />
      </section>

      <section className="panel-card">
        <h2>Historial de casos</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código KUSI</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Fechas</th>
                <th>Tiempo total</th>
                <th>Trazabilidad</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td><strong>{alert.code}</strong></td>
                  <td><StatusBadge status={alert.status} /></td>
                  <td>{alert.assignedSereno?.name || (alert.histories && alert.histories.length > 0 ? alert.histories[alert.histories.length - 1].responsibleName : "Central")}</td>
                  <td>{formatDate(alert.createdAt)}</td>
                  <td><TraceTimes createdAt={alert.createdAt} receivedAt={alert.receivedAt} assignedAt={alert.assignedAt} interventionAt={alert.interventionAt} attendedAt={alert.attendedAt} /></td>
                  <td>{alert.histories?.length ?? 0} eventos</td>
                  <td>{alert.rating ? `${alert.rating.stars}/5` : "Sin calificar"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel-card">
        <h2>Control de reportes rechazados</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ciudadano ficticio</th>
                <th>Código</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acción simulada</th>
              </tr>
            </thead>
            <tbody>
              {summary?.rejectedControls?.map((item) => (
                <tr key={item.id}>
                  <td>{item.citizen?.name || "Ciudadano demo"}</td>
                  <td>{item.alert?.code || "KUSI"}</td>
                  <td>{item.reason}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.action === "WARNING_GENERATED" ? "Advertencia generada" : item.action === "ACCOUNT_OBSERVED" ? "Cuenta observada" : "Sin bloqueo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="disclaimer">El sistema no bloquea realmente al ciudadano. El control es demostrativo y evita gamificación tradicional.</p>
      </section>
    </main>
  );
}
