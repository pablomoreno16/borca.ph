import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¿Por qué elegirnos? – BORCA",
};

export default function PorQueElegirnosPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-label">Nuestra diferencia</p>
          <h1>
            ¿Por qué elegir
            <br />
            <span>BORCA?</span>
          </h1>
          <p>
            No somos solo administradores. Somos aliados estratégicos que transforman el día a
            día de tu comunidad con compromiso real, transparencia total y resultados medibles.
          </p>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Lo que nos hace únicos
            </p>
            <h2 className="section-title">
              6 razones para <span>elegirnos</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3>Transparencia administrativa</h3>
              <p>
                Cada peso ingresado y gastado está documentado. Informes mensuales claros,
                acceso digital en tiempo real.
              </p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-people-roof"></i>
              </div>
              <h3>Atención personalizada</h3>
              <p>Asignamos un gestor dedicado que conoce tu conjunto, su historia y necesidades particulares.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>Enfoque preventivo</h3>
              <p>
                Anticipamos problemas antes de que ocurran para proteger el valor de tu propiedad
                a largo plazo.
              </p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Red de aliados expertos</h3>
              <p>Contamos con proveedores verificados en todas las áreas para ofrecer siempre la mejor solución.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <h3>Cobertura real</h3>
              <p>Cobertura en Medellín, Área Metropolitana, Oriente Antioqueño.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Vocación de servicio</h3>
              <p>
                Trabajamos con pasión y compromiso genuino para el bienestar de cada comunidad
                que administramos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-gray">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Lo que dicen nuestros clientes
            </p>
            <h2 className="section-title">
              Testimonios <span>reales</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-border">
              <div style={{ display: "flex", gap: "3px", color: "var(--gold)", marginBottom: "14px", fontSize: "14px" }}>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p style={{ fontSize: "14.5px", color: "var(--text-body)", lineHeight: "1.75", marginBottom: "18px", fontStyle: "italic" }}>
                &quot;BORCA transformó la organización financiera de nuestra copropiedad. Ahora
                sabemos exactamente en qué se gasta cada peso.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "15px" }}
                >
                  C
                </div>
                <div>
                  <strong style={{ fontSize: "14.5px", display: "block" }}>Cliente Copropiedad</strong>
                  <span style={{ fontSize: "12px", color: "#999" }}>Medellín, Antioquia</span>
                </div>
              </div>
            </div>
            <div className="card card-border">
              <div style={{ display: "flex", gap: "3px", color: "var(--gold)", marginBottom: "14px", fontSize: "14px" }}>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p style={{ fontSize: "14.5px", color: "var(--text-body)", lineHeight: "1.75", marginBottom: "18px", fontStyle: "italic" }}>
                &quot;La comunicación y el acompañamiento han sido excelentes. Sentimos que
                realmente nos entienden.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "15px" }}
                >
                  J
                </div>
                <div>
                  <strong style={{ fontSize: "14.5px", display: "block" }}>Junta Directiva</strong>
                  <span style={{ fontSize: "12px", color: "#999" }}>Bogotá, Cundinamarca</span>
                </div>
              </div>
            </div>
            <div className="card card-border">
              <div style={{ display: "flex", gap: "3px", color: "var(--gold)", marginBottom: "14px", fontSize: "14px" }}>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p style={{ fontSize: "14.5px", color: "var(--text-body)", lineHeight: "1.75", marginBottom: "18px", fontStyle: "italic" }}>
                &quot;BORCA transformó por completo la cultura de nuestra copropiedad. Ahora es un
                mejor lugar para vivir.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1a5fa8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "15px" }}
                >
                  P
                </div>
                <div>
                  <strong style={{ fontSize: "14.5px", display: "block" }}>Propietario</strong>
                  <span style={{ fontSize: "12px", color: "#999" }}>Cali, Valle del Cauca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Cómo trabajamos
            </p>
            <h2 className="section-title">
              Proceso de <span>vinculación en 3 pasos</span>
            </h2>
            <p style={{ color: "var(--text-body)", fontSize: "16.5px", maxWidth: "520px", margin: "0 auto", lineHeight: "1.8" }}>
              Vincularse a BORCA es simple, rápido y sin complicaciones. Te acompañamos en cada
              paso.
            </p>
          </div>
          {/* nota: el sitio original no envolvía estas 3 tarjetas en cards-grid-3 (bug visual corregido en esta migración) */}
          <div className="cards-grid-3">
            <div className="card card-border" style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "42px", fontWeight: "700", color: "var(--gold)", opacity: ".25", lineHeight: "1", marginBottom: "-4px" }}>
                01
              </div>
              <div className="card-icon-lg" style={{ margin: "0 auto 14px" }}>
                <i className="fa-solid fa-file-signature"></i>
              </div>
              <h3 style={{ fontSize: "16.5px" }}>Propuesta personalizada</h3>
              <p style={{ fontSize: "14px" }}>Plan diseñado según necesidades de tu conjunto.</p>
            </div>
            <div className="card card-border" style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "42px", fontWeight: "700", color: "var(--gold)", opacity: ".25", lineHeight: "1", marginBottom: "-4px" }}>
                02
              </div>
              <div className="card-icon-lg" style={{ margin: "0 auto 14px" }}>
                <i className="fa-solid fa-people-group"></i>
              </div>
              <h3 style={{ fontSize: "16.5px" }}>Presentación a asamblea o consejo de administración</h3>
              <p style={{ fontSize: "14px" }}>Acompañamos la presentación para aprobación en caso de ser requerida.</p>
            </div>
            <div className="card card-border" style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "42px", fontWeight: "700", color: "var(--gold)", opacity: ".25", lineHeight: "1", marginBottom: "-4px" }}>
                03
              </div>
              <div className="card-icon-lg" style={{ margin: "0 auto 14px" }}>
                <i className="fa-solid fa-rocket"></i>
              </div>
              <h3 style={{ fontSize: "16.5px" }}>Inicio de operaciones</h3>
              <p style={{ fontSize: "14px" }}>Transición ordenada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <h2>Comencemos a transformar tu copropiedad.</h2>
        <p>Estamos listos para acompañarte.</p>
        <Link href="/contacto" className="btn-cta">
          <i className="fa-solid fa-magnifying-glass"></i> Contáctanos
        </Link>
      </section>
    </>
  );
}
