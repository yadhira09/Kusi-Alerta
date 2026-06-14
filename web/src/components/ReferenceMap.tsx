export function ReferenceMap() {
  return (
    <section className="reference-map" aria-label="Mapa referencial del Mercado Santa Rosa y alrededores">
      <div className="map-grid">
        <span className="street horizontal top">Av. referencial</span>
        <span className="street horizontal bottom">Calle referencial</span>
        <span className="street vertical left">Vía lateral</span>
        <span className="street vertical right">Vía lateral</span>
        <div className="market">Mercado Santa Rosa</div>
        <div className="radius">Radio referencial: 5 cuadras</div>
        <div className="critical-zone">Zona crítica simulada</div>
      </div>
      <p>Mapa demostrativo. No usa coordenadas exactas ni ubicación identificable de personas.</p>
    </section>
  );
}
