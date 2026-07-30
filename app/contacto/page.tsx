import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto – BORCA",
};

export default function ContactoPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-label">Estamos para ayudarte</p>
          <h1>
            Comencemos a transformar tu <br />
            <span>copropiedad</span>
          </h1>
          <p>Contacta directamente con nuestro equipo.</p>
        </div>
      </section>

      {/* MOTIVOS DE CONTACTO */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              ¿En qué podemos ayudarte?
            </p>
            <h2 className="section-title">
              Elige tu motivo <span>de consulta</span>
            </h2>
          </div>
          <div className="cards-grid-2" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                background: "var(--white)",
                borderRadius: "var(--r-xl)",
                padding: "22px 20px",
                boxShadow: "var(--shadow-card)",
                border: "1.5px solid #e8eeed",
                textDecoration: "none",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  minWidth: "56px",
                  borderRadius: "14px",
                  background: "var(--card-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "var(--teal)",
                }}
              >
                <i className="fa-solid fa-building"></i>
              </div>
              <div style={{ flex: "1" }}>
                <h3 style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--text-dark)", marginBottom: "5px" }}>
                  Administración de PH
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.55" }}>
                  Quiero contratar administración profesional para mi copropiedad.
                </p>
              </div>
              <div style={{ fontSize: "22px", color: "#25D366", flexShrink: "0" }}>
                <i className="fa-brands fa-whatsapp"></i>
              </div>
            </a>
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+necesito+asesor%C3%ADa+jur%C3%ADdica+o+de+gesti%C3%B3n+especializada"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                background: "var(--white)",
                borderRadius: "var(--r-xl)",
                padding: "22px 20px",
                boxShadow: "var(--shadow-card)",
                border: "1.5px solid #e8eeed",
                textDecoration: "none",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  minWidth: "56px",
                  borderRadius: "14px",
                  background: "var(--card-beige)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "#a07840",
                }}
              >
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div style={{ flex: "1" }}>
                <h3 style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--text-dark)", marginBottom: "5px" }}>
                  Consultoría PH
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.55" }}>
                  Necesito asesoría jurídica o de gestión especializada.
                </p>
              </div>
              <div style={{ fontSize: "22px", color: "#25D366", flexShrink: "0" }}>
                <i className="fa-brands fa-whatsapp"></i>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
