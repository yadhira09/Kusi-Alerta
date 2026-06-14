import { useEffect, useState } from "react";
import { durationBetween, elapsedLabel } from "../utils/labels";

export function TimerText({ from, label = "Tiempo desde creación" }: { from?: string | null; label?: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="timer">{label}: {elapsedLabel(from)}</span>;
}

export function TraceTimes({ createdAt, receivedAt, assignedAt, interventionAt, attendedAt }: { createdAt?: string | null; receivedAt?: string | null; assignedAt?: string | null; interventionAt?: string | null; attendedAt?: string | null }) {
  return (
    <dl className="trace-grid">
      <div><dt>Desde creación</dt><dd>{elapsedLabel(createdAt)}</dd></div>
      <div><dt>Creación → recepción</dt><dd>{durationBetween(createdAt, receivedAt)}</dd></div>
      <div><dt>Recepción → asignación</dt><dd>{durationBetween(receivedAt, assignedAt)}</dd></div>
      <div><dt>Asignación → intervención</dt><dd>{durationBetween(assignedAt, interventionAt)}</dd></div>
      <div><dt>Total hasta atención</dt><dd>{durationBetween(createdAt, attendedAt)}</dd></div>
    </dl>
  );
}
