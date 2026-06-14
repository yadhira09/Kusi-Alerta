import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="home-shell">
      <section className="hero-card">
        <p className="eyebrow">Hackatón TransformaGob 2026 · Desafío 9</p>
        <h1>KusiAlerta</h1>
        <p className="subtitle">Ciudadano protegido, Serenazgo en ruta.</p>
        <p>
          Prototipo funcional con datos ficticios para reportar incidencias cerca del Mercado Santa Rosa y seguir la atención sin llamadas.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/operator">Panel operador</Link>
          <Link className="button secondary" to="/admin">Panel administrador</Link>
        </div>
      </section>
    </main>
  );
}
