import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiénes somos – BORCA",
};

export default function QuienesSomosPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-label">Nuestra historia</p>
          <h1>
            Quiénes somos
            <br />
            <span>BORCA</span>
          </h1>
          <p>
            Somos una empresa especializada en la administración integral de Propiedad
            Horizontal en Colombia. Trabajamos con compromiso, transparencia y visión
            estratégica para garantizar el adecuado manejo financiero, operativo y humano de
            cada copropiedad.
          </p>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / VALORES */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div className="cards-grid-3">
            <div className="card card-teal">
              <div className="card-icon-lg">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h3>Nuestra Misión</h3>
              <p>
                Transformar copropiedades mediante una gestión integral eficiente, transparente
                y humana, enfocada en la protección del patrimonio, la optimización de recursos
                y el fortalecimiento de las comunidades.
              </p>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-eye"></i>
              </div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser una empresa líder en transformación y administración de Propiedad
                Horizontal en Colombia, reconocida por excelencia operativa, innovación y
                capacidad para generar bienestar y valorización.
              </p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg">
                <i className="fa-solid fa-gem"></i>
              </div>
              <h3>Nuestro Propósito</h3>
              <p>
                Transformar comunidades mediante una administración consciente que promueva
                convivencia, sostenibilidad y valorización de los inmuebles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEXTO QUIÉNES SOMOS */}
      <section className="bg-gray">
        <div className="section-wrap section-pad">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "start" }}
          >
            <div>
              <p className="section-label">Nuestra trayectoria</p>
              <h2 className="section-title">
                Una empresa con <span>experiencia y vocación</span>
              </h2>
              <p
                className="section-lead"
                style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "18px", marginBottom: "24px" }}
              >
                BORCA es una empresa especializada en la administración integral de propiedades
                horizontales. Contamos con un equipo interdisciplinario y aliados estratégicos
                que nos permiten brindar soluciones ágiles, efectivas y profesionales.
              </p>
              <p style={{ fontSize: "15.5px", color: "var(--text-body)", lineHeight: "1.8", marginBottom: "20px" }}>
                Nuestro enfoque está orientado a la optimización de recursos, la sana
                convivencia y la valorización del patrimonio de cada copropiedad. Trabajamos con
                cada comunidad como si fuera la nuestra, comprometidos con su transformación y
                bienestar a largo plazo.
              </p>
              <p style={{ fontSize: "15.5px", color: "var(--text-body)", lineHeight: "1.8" }}>
                Con más de 10 años de experiencia en el sector, hemos aprendido que administrar
                una copropiedad no es solo manejar números y procesos. Es cuidar comunidades,
                proteger patrimonios y crear espacios donde las personas quieren vivir.
              </p>
            </div>
            <div>
              <img
                src="/images/team.jpg"
                alt="Equipo BORCA"
                style={{
                  width: "100%",
                  borderRadius: "22px",
                  boxShadow: "var(--shadow-soft)",
                  objectFit: "cover",
                  height: "380px",
                  objectPosition: "center top",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PILARES EXPANDIDO */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Lo que nos define
            </p>
            <h2 className="section-title">
              Nuestros 6 <span>pilares fundamentales</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-green)", color: "var(--teal)" }}>
                <i className="fa-solid fa-people-group"></i>
              </div>
              <h3>Participación</h3>
              <p>
                Creemos en comunidades donde cada voz aporta al crecimiento y bienestar
                colectivo. Tu opinión importa.
              </p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-beige)", color: "#a07840" }}>
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Pasión</h3>
              <p>Amamos lo que hacemos y trabajamos con compromiso, entrega y vocación genuina de servicio.</p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-blue)", color: "#1a5fa8" }}>
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3>Experiencia</h3>
              <p>Nuestra trayectoria nos permite tomar decisiones estratégicas y efectivas en cada situación.</p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-lila)", color: "#7a4eb0" }}>
                <i className="fa-solid fa-rocket"></i>
              </div>
              <h3>Proactividad</h3>
              <p>Nos anticipamos a las necesidades para generar soluciones oportunas y prevenir problemas.</p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-green)", color: "var(--teal)" }}>
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Profesionalismo</h3>
              <p>Actuamos con ética, responsabilidad, respeto y transparencia en cada proceso y decisión.</p>
            </div>
            <div className="card card-border">
              <div className="card-icon-lg" style={{ background: "var(--card-beige)", color: "#a07840" }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3>Progreso</h3>
              <p>Trabajamos por el crecimiento, sostenibilidad y valorización de cada comunidad a largo plazo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="bg-gray">
        <div className="section-wrap section-pad">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              Talento humano
            </p>
            <h2 className="section-title">
              Un equipo comprometido <span>con tu comunidad</span>
            </h2>
            <p style={{ color: "var(--text-body)", fontSize: "16.5px", maxWidth: "560px", margin: "0 auto", lineHeight: "1.8" }}>
              Contamos con profesionales interdisciplinarios especializados en administración,
              finanzas, derecho y operación de copropiedades.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
            <div className="card card-gray" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "white",
                  margin: "0 auto 16px",
                }}
              >
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <h4 style={{ fontSize: "15.5px", fontWeight: "800", marginBottom: "4px" }}>Gestores dedicados</h4>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.65" }}>
                Profesional asignado a cada copropiedad conoce su realidad en profundidad.
              </p>
            </div>
            <div className="card card-gray" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "white",
                  margin: "0 auto 16px",
                }}
              >
                <i className="fa-solid fa-gavel"></i>
              </div>
              <h4 style={{ fontSize: "15.5px", fontWeight: "800", marginBottom: "4px" }}>Especialistas jurídicos</h4>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.65" }}>
                Asesoría en Ley 675 y normativa de Propiedad Horizontal aplicable.
              </p>
            </div>
            <div className="card card-gray" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "white",
                  margin: "0 auto 16px",
                }}
              >
                <i className="fa-solid fa-chart-bar"></i>
              </div>
              <h4 style={{ fontSize: "15.5px", fontWeight: "800", marginBottom: "4px" }}>Analistas financieros</h4>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.65" }}>
                Gestión de presupuestos, estados financieros y control de cartera.
              </p>
            </div>
            <div className="card card-gray" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "white",
                  margin: "0 auto 16px",
                }}
              >
                <i className="fa-solid fa-wrench"></i>
              </div>
              <h4 style={{ fontSize: "15.5px", fontWeight: "800", marginBottom: "4px" }}>Coordinadores operativos</h4>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.65" }}>
                Supervisión de mantenimiento y servicios especializados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <h2>¿Quieres conocernos en persona?</h2>
        <p>Agenda una reunión con nuestro equipo y descubre cómo transformamos copropiedades.</p>
        <Link href="/contacto" className="btn-cta">
          <i className="fa-solid fa-calendar-check"></i> Agenda una reunión
        </Link>
      </section>
    </>
  );
}
