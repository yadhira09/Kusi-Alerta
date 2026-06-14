import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AlertDto, SerenoDto } from "../../types";
import { assignAlert, getAlert, getSerenos, receiveAlert, rejectAlert } from "../../services/api";
import { createPanelSocket } from "../../services/socket";
import { AlertTimeline } from "../../components/AlertTimeline";
import { ReferenceMap } from "../../components/ReferenceMap";
import { SerenoSemaphore } from "../../components/SerenoSemaphore";
import { PriorityBadge, StatusBadge } from "../../components/StatusBadge";
import { TimerText, TraceTimes } from "../../components/TimerText";
import { formatDate } from "../../utils/labels";

const rejectionReasons = [
  "No corresponde a Seguridad Ciudadana",
  "Información insuficiente",
  "Reporte duplicado",
  "Falsa alarma/broma",
  "Otro"
];

export function AlertDetailPage() {
  const { id } = useParams();
  const [alert, setAlert] = useState<AlertDto | null>(null);
  const [serenos, setSerenos] = useState<SerenoDto[]>([]);
  const [selectedSerenoId, setSelectedSerenoId] = useState("");
  const [reason, setReason] = useState(rejectionReasons[0]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    const [alertData, serenoData] = await Promise.all([getAlert(id), getSerenos()]);
    setAlert(alertData);
    setSerenos(serenoData);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const socket = createPanelSocket("operator");
    socket.on("alert_updated", (updated: AlertDto) => {
      if (updated.id === id) void load();
    });
    return () => socket.disconnect();
  }, [id, load]);

  async function handleReceive() {
    if (!alert) return;
    const updated = await receiveAlert(alert.id);
    setAlert(updated);
    setMessage("Tu alerta fue recibida por Central.");
  }

  async function handleAssign() {
    if (!alert || !selectedSerenoId) return;
    const updated = await assignAlert(alert.id, selectedSerenoId);
    setAlert(updated);
    setMessage("Alerta asignada correctamente.");
    void load();
  }

  async function handleReject() {
    if (!alert) return;
    const updated = await rejectAlert(alert.id, reason);
    setAlert(updated);
    setMessage("Reporte rechazado y registrado en control de trazabilidad.");
  }

  if (!alert) {
    return <main className="page-shell"><p>Cargando detalle de alerta...</p></main>;
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <Link to="/operator" className="back-link">← Volver al panel operador</Link>
          <p className="eyebrow">Detalle de alerta</p>
          <h1>{alert.code}</h1>
          <p>Registro completo de atención, ubicación referencial y acciones de Central.</p>
        </div>
      </header>

      <p className="sr-live" aria-live="polite">{message}</p>

      <section className="detail-layout">
        <article className="panel-card detail-card">
          <div className="detail-header">
            <div>
              <h2>{alert.type}</h2>
              <p>{alert.description || "Sin descripción adicional."}</p>
            </div>
            <div className="badge-stack">
              <StatusBadge status={alert.status} />
              <PriorityBadge priority={alert.priority} />
            </div>
          </div>
          <dl className="info-list">
            <div><dt>ID interno</dt><dd>{alert.id}</dd></div>
            <div><dt>Ciudadano ficticio</dt><dd>{alert.citizen?.name || "Rosa Quispe"}</dd></div>
            <div><dt>Ubicación</dt><dd>{alert.locationText}</dd></div>
            <div><dt>Referencia</dt><dd>{alert.reference}</dd></div>
            <div><dt>Evidencia simulada</dt><dd>{alert.evidenceText || "Sin evidencia por seguridad"}</dd></div>
            <div><dt>Sereno asignado</dt><dd>{alert.assignedSereno?.name || "Sin asignar"}</dd></div>
            <div><dt>Fecha y hora</dt><dd>{formatDate(alert.createdAt)}</dd></div>
          </dl>
          <TimerText from={alert.createdAt} />
          <TraceTimes createdAt={alert.createdAt} receivedAt={alert.receivedAt} assignedAt={alert.assignedAt} interventionAt={alert.interventionAt} attendedAt={alert.attendedAt} />
        </article>

        <aside className="panel-card actions-card">
          <h2>Acciones del operador</h2>
          <button type="button" onClick={handleReceive} disabled={!(["PENDIENTE"].includes(alert.status))}>Marcar como recibida</button>
          <div className="assign-box">
            <h3>Asignar sereno</h3>
            <SerenoSemaphore serenos={serenos} selectedSerenoId={selectedSerenoId} onSelect={setSelectedSerenoId} />
            <button type="button" onClick={handleAssign} disabled={!selectedSerenoId || !["RECIBIDO", "PENDIENTE"].includes(alert.status)}>Asignar sereno</button>
          </div>
          <div className="reject-box">
            <h3>Rechazar alerta</h3>
            <label>
              Motivo
              <select value={reason} onChange={(event) => setReason(event.target.value)}>
                {rejectionReasons.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <button className="danger" type="button" onClick={handleReject} disabled={["ATENDIDO", "RECHAZADO"].includes(alert.status)}>Rechazar alerta</button>
          </div>
        </aside>
      </section>

      <section className="detail-layout">
        <article className="panel-card">
          <h2>Historial de trazabilidad</h2>
          <AlertTimeline alert={alert} />
        </article>
        <ReferenceMap />
      </section>
    </main>
  );
}
