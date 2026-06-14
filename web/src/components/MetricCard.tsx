export function MetricCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return (
    <article className="metric-card" aria-label={`${title}: ${value}`}>
      <p>{title}</p>
      <strong>{value}</strong>
      {helper ? <span>{helper}</span> : null}
    </article>
  );
}
