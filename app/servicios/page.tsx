import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios – BORCA",
};

export default function ServiciosPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-label">Lo que ofrecemos</p>
          <h1>
            Soluciones integrales <span>para tu copropiedad</span>
          </h1>
          <p>
            Brindamos servicios especializados para la administración y fortalecimiento de
            propiedades horizontales, mediante una gestión estratégica enfocada en eficiencia,
            tranquilidad y protección del patrimonio.
          </p>
        </div>
      </section>

      {/* SERVICIO 1 */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", marginBottom: "72px" }}
          >
            <div>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "var(--card-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "var(--teal)",
                  marginBottom: "20px",
                }}
              >
                <i className="fa-solid fa-building"></i>
              </div>
              <p className="section-label">01</p>
              <h2 className="section-title" style={{ fontSize: "28px" }}>
                Administración de
                <br />
                <span>Propiedad Horizontal</span>
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: "1.8", marginBottom: "24px" }}>
                Gerencia integral de copropiedades residenciales, comerciales, mixtas,
                corporativas e industriales, mediante planes de trabajo diseñados según las
                necesidades específicas de cada comunidad.
              </p>
              <h4 style={{ fontSize: "15.5px", fontWeight: "800", marginBottom: "14px" }}>
                Nuestra gestión está enfocada en:
              </h4>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Optimización financiera</strong>
                  <p>Control riguroso de presupuestos e ingresos.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Control administrativo</strong>
                  <p>Procesos ágiles y documentación completa.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Mantenimiento preventivo</strong>
                  <p>Cuidado integral de bienes comunes.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Seguridad y convivencia</strong>
                  <p>Ambientes seguros y armónicos para todos.</p>
                </div>
              </div>
            </div>
            <div
              style={{ background: "var(--card-green)", borderRadius: "22px", padding: "36px", display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div className="card card-border" style={{ background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <i className="fa-solid fa-file-invoice-dollar" style={{ color: "var(--teal)", fontSize: "20px" }}></i>
                  <strong style={{ fontSize: "14.5px" }}>Informes financieros detallados</strong>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6" }}>
                  Estados de cuenta precisos con todos los movimientos económicos.
                </p>
              </div>
              <div className="card card-border" style={{ background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <i className="fa-solid fa-mobile-screen" style={{ color: "var(--teal)", fontSize: "20px" }}></i>
                  <strong style={{ fontSize: "14.5px" }}>Portal digital para propietarios</strong>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6" }}>
                  Acceso en línea a recibos, actas y comunicados.
                </p>
              </div>
              <div className="card card-border" style={{ background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <i className="fa-solid fa-headset" style={{ color: "var(--teal)", fontSize: "20px" }}></i>
                  <strong style={{ fontSize: "14.5px" }}>Atención disponible</strong>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6" }}>
                  Comunicación constante y respuesta rápida a consultas.
                </p>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* SERVICIO 2 */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", marginBottom: "72px" }}
          >
            <div style={{ background: "var(--card-beige)", borderRadius: "22px", padding: "36px", order: "2" }}>
              <h4 style={{ fontSize: "14.5px", fontWeight: "800", marginBottom: "18px" }}>Servicios incluidos:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="card card-border" style={{ background: "white", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="fa-solid fa-gavel" style={{ color: "#a07840", fontSize: "18px" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Interpretación Ley 675</span>
                  </div>
                </div>
                <div className="card card-border" style={{ background: "white", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="fa-solid fa-file-contract" style={{ color: "#a07840", fontSize: "18px" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Elaboración y reforma de reglamentos</span>
                  </div>
                </div>
                <div className="card card-border" style={{ background: "white", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="fa-solid fa-people-group" style={{ color: "#a07840", fontSize: "18px" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Mediación de conflictos</span>
                  </div>
                </div>
                <div className="card card-border" style={{ background: "white", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ color: "#a07840", fontSize: "18px" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Diagnóstico de gestión</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ order: "1" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "var(--card-beige)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#a07840",
                  marginBottom: "20px",
                }}
              >
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <p className="section-label">02</p>
              <h2 className="section-title" style={{ fontSize: "28px" }}>
                Consultoría <span>PH</span>
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: "1.8", marginBottom: "20px" }}>
                Contamos con aliados especializados en Propiedad Horizontal para brindar
                acompañamiento técnico, jurídico y administrativo en procesos complejos de
                gestión de copropiedades.
              </p>
              <Link
                href="/contacto"
                className="btn-cta"
                style={{ fontSize: "14.5px", padding: "11px 24px", background: "var(--card-beige)", color: "#a07840", border: "1.5px solid #e0c88a" }}
              >
                <i className="fa-solid fa-phone"></i> Solicitar consulta
              </Link>
            </div>
          </div>

          <div className="divider"></div>

          {/* SERVICIO 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "var(--card-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#1a5fa8",
                  marginBottom: "20px",
                }}
              >
                <i className="fa-solid fa-toolbox"></i>
              </div>
              <p className="section-label">03</p>
              <h2 className="section-title" style={{ fontSize: "28px" }}>
                Servicios <span>Especializados</span>
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: "1.8", marginBottom: "24px" }}>
                A través de nuestras alianzas estratégicas ofrecemos servicios complementarios
                que fortalecen la operación y sostenibilidad de las copropiedades.
              </p>
              <div className="check-item">
                <span className="check-dot" style={{ background: "#1a5fa8" }}>
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Contabilidad y cartera</strong>
                  <p>Gestión completa de cuentas y cobro de cuotas morosas.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot" style={{ background: "#1a5fa8" }}>
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Mantenimiento locativo</strong>
                  <p>Reparación y mantenimiento preventivo de infraestructuras.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot" style={{ background: "#1a5fa8" }}>
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Aseo, jardinería y seguridad</strong>
                  <p>Servicios operativos continuos para bienes comunes.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot" style={{ background: "#1a5fa8" }}>
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Seguros y asesoría legal</strong>
                  <p>Cobertura de riesgos y acompañamiento jurídico especializado.</p>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--card-blue)", borderRadius: "22px", padding: "36px", textAlign: "center" }}>
              <i
                className="fa-solid fa-handshake"
                style={{ fontSize: "56px", color: "#1a5fa8", opacity: ".4", marginBottom: "20px", display: "block" }}
              ></i>
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "12px" }}>Red de aliados certificados</h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-body)", lineHeight: "1.8" }}>
                Proveedores verificados en todas las áreas para garantizar calidad en cada
                servicio contratado.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
                <span style={{ background: "white", borderRadius: "50px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#1a5fa8" }}>
                  Vigilancia
                </span>
                <span style={{ background: "white", borderRadius: "50px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#1a5fa8" }}>
                  Mantenimiento
                </span>
                <span style={{ background: "white", borderRadius: "50px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#1a5fa8" }}>
                  Jardinería
                </span>
                <span style={{ background: "white", borderRadius: "50px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#1a5fa8" }}>
                  Contabilidad
                </span>
                <span style={{ background: "white", borderRadius: "50px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#1a5fa8" }}>
                  Seguros
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <h2>¿Cuál servicio necesita tu copropiedad?</h2>
        <p>Cuéntanos sobre tu comunidad y diseñamos una propuesta a la medida.</p>
        <Link href="/contacto" className="btn-cta">
          <i className="fa-solid fa-paper-plane"></i> Solicita tu propuesta
        </Link>
      </section>
    </>
  );
}
