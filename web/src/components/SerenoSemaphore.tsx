import type { SerenoDto } from "../types";
import { availabilityLabels } from "../utils/labels";

export function SerenoSemaphore({ serenos, selectedSerenoId, onSelect }: { serenos: SerenoDto[]; selectedSerenoId?: string; onSelect: (id: string) => void }) {
  return (
    <div className="sereno-list" role="radiogroup" aria-label="Semáforo operativo de serenos">
      {serenos.map((sereno) => {
        const available = sereno.availability === "DISPONIBLE";
        return (
          <button
            key={sereno.id}
            type="button"
            className={`sereno-card ${sereno.availability.toLowerCase()} ${selectedSerenoId === sereno.id ? "selected" : ""}`}
            onClick={() => available && onSelect(sereno.id)}
            disabled={!available}
            aria-pressed={selectedSerenoId === sereno.id}
          >
            <span className="semaphore-dot" aria-hidden="true" />
            <strong>{sereno.name}</strong>
            <span>{availabilityLabels[sereno.availability]}</span>
            <small>{sereno.currentZone}</small>
            {!available ? <em>No disponible para asignación</em> : <em>Puede asignarse</em>}
          </button>
        );
      })}
    </div>
  );
}
