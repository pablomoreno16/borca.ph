import Link from "next/link";
import { PromoCarousel } from "./PromoCarousel";
import { ButterflyIcon } from "@/shared/ui/ButterflyIcon";

export default function HomePage() {
  return (
    <>
      {/* CARRUSEL DE NOVEDADES (promociones, noticias, anuncios y actualizaciones) */}
      <section className="promo-section bg-gray" id="carrusel">
        <PromoCarousel />
      </section>

      {/* HERO SECTION */}
      <section
        id="hero"
        style={{
          background: "linear-gradient(135deg,var(--teal) 0%,var(--teal-dark) 100%)",
          padding: 0,
          minHeight: "600px",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
        }}
      >
        <div style={{ padding: "56px 36px", position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "50px",
              fontWeight: "700",
              color: "white",
              lineHeight: "1.15",
              marginBottom: "16px",
            }}
          >
            Transformamos
            <br />
            <span style={{ color: "var(--gold)", fontStyle: "italic" }}>copropiedades</span>
          </h1>
          <p style={{ fontSize: "16.5px", color: "rgba(255,255,255,0.85)", lineHeight: "1.8", maxWidth: "480px", marginBottom: "32px" }}>
            Creamos comunidades más organizadas, sostenibles y tranquilas mediante una
            administración estratégica, humana y eficiente. Nuestro enfoque está orientado a la
            optimización de recursos, la sana convivencia y la valorización del patrimonio.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
              style={{ background: "var(--gold)" }}
            >
              <ButterflyIcon /> Contáctanos
            </a>
            <Link href="/servicios" className="btn-cta" style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid white" }}>
              <i className="fa-solid fa-arrow-right"></i> Conoce nuestros servicios
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <img
            src="/images/hero-borca.jpg"
            alt="Comunidad BORCA"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(200,169,107,0.12)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>
      </section>

      {/* PILARES */}
      <section className="bg-white" id="pilares">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Nuestros pilares
            </p>
            <h2 className="section-title">
              6 valores que guían <span>cada decisión</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-people-group"></i>
              </div>
              <h3>Participación</h3>
              <p>Creemos en comunidades donde cada voz aporta al crecimiento y bienestar colectivo.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Pasión</h3>
              <p>Amamos lo que hacemos y trabajamos con compromiso, entrega y vocación de servicio.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3>Experiencia</h3>
              <p>Nuestra trayectoria nos permite tomar decisiones estratégicas y efectivas.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-rocket"></i>
              </div>
              <h3>Proactividad</h3>
              <p>Nos anticipamos a las necesidades de cada copropiedad para soluciones oportunas.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Profesionalismo</h3>
              <p>Actuamos con ética, responsabilidad, respeto y transparencia en cada proceso.</p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3>Progreso</h3>
              <p>Trabajamos por crecimiento, sostenibilidad y valorización de cada comunidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS PREVIEW */}
      <section className="bg-gray" id="servicios-preview">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Soluciones integrales
            </p>
            <h2 className="section-title">
              ¿Qué ofrecemos <span>a nuestros clientes?</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <Link href="/servicios" className="card card-border" style={{ textDecoration: "none", cursor: "pointer", transition: "all .2s" }}>
              <div className="card-icon-lg">
                <i className="fa-solid fa-building"></i>
              </div>
              <h3>Administración de PH</h3>
              <p>Gestión integral de copropiedades residenciales, comerciales, mixtas.</p>
              <div style={{ color: "var(--teal)", fontWeight: "700", fontSize: "14.5px", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
            <Link href="/servicios" className="card card-border" style={{ textDecoration: "none", cursor: "pointer", transition: "all .2s" }}>
              <div className="card-icon-lg">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3>Consultoría PH</h3>
              <p>Acompañamiento técnico, jurídico y administrativo en procesos especializados.</p>
              <div style={{ color: "var(--teal)", fontWeight: "700", fontSize: "14.5px", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
            <Link href="/servicios" className="card card-border" style={{ textDecoration: "none", cursor: "pointer", transition: "all .2s" }}>
              <div className="card-icon-lg">
                <i className="fa-solid fa-toolbox"></i>
              </div>
              <h3>Servicios Especializados</h3>
              <p>Contabilidad, mantenimiento, facturación, aseo, jardinería, seguros y más a través de alianzas.</p>
              <div style={{ color: "var(--teal)", fontWeight: "700", fontSize: "14.5px", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-gray" id="por-que-elegirnos">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Nuestra diferencia
            </p>
            <h2 className="section-title">
              ¿Por qué<span> elegirnos?</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-teal">
              <div className="card-icon-lg">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3>Transparencia</h3>
              <p>Cada peso ingresado está documentado. Informes claros y acceso digital en tiempo real.</p>
            </div>
            <div className="card card-teal">
              <div className="card-icon-lg">
                <i className="fa-solid fa-people-roof"></i>
              </div>
              <h3>Gestión humanizada</h3>
              <p>Un gestor dedicado a cada copropiedad que conoce su historia y necesidades.</p>
            </div>
            <div className="card card-teal">
              <div className="card-icon-lg">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>Enfoque preventivo</h3>
              <p>Anticipamos problemas para proteger el valor de tu propiedad a largo plazo.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Link href="/por-que-elegirnos" className="btn-cta">
              <i className="fa-solid fa-arrow-right"></i> Ver más razones
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip" id="cta-final">
        <h2>Comencemos a transformar tu copropiedad.</h2>
        <p>Estamos listos para acompañarte.</p>
        <a
          href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
        >
          <ButterflyIcon /> Contáctanos
        </a>
      </section>
    </>
  );
}
