import Link from "next/link";
import { PromoCarousel } from "./PromoCarousel";
import { ButterflyIcon } from "@/shared/ui/ButterflyIcon";

// Pendiente: el carrusel tiene datos estáticos hardcodeados. Se oculta hasta
// conectarlo a Supabase (Fase 1, ver docs/architecture/07-roadmap-fases.md).
// Reactivar cambiando esto a true una vez esté conectado a datos reales.
const CARRUSEL_HABILITADO = false;

export default function HomePage() {
  return (
    <>
      {/* CARRUSEL DE NOVEDADES (promociones, noticias, anuncios y actualizaciones) */}
      {CARRUSEL_HABILITADO && (
        <section className="promo-section bg-gray" id="carrusel">
          <PromoCarousel />
        </section>
      )}

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative overflow-hidden p-0 min-h-[600px] grid grid-cols-1 md:grid-cols-2 items-center"
        style={{ background: "linear-gradient(135deg,var(--color-teal) 0%,var(--color-teal-dark) 100%)" }}
      >
        <div className="relative z-10 py-11 px-5 md:py-14 md:px-9">
          <h1 className="font-serif text-[32px] md:text-[50px] font-bold text-white leading-[1.15] mb-4">
            Transformamos
            <br />
            <span className="text-gold italic">copropiedades</span>
          </h1>
          <p className="text-[16.5px] text-white/85 leading-[1.8] max-w-[480px] mb-8">
            Creamos comunidades más organizadas, sostenibles y tranquilas mediante una
            administración estratégica, humana y eficiente. Nuestro enfoque está orientado a la
            optimización de recursos, la sana convivencia y la valorización del patrimonio.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta bg-gold"
            >
              <ButterflyIcon /> Contáctanos
            </a>
            <Link href="/servicios" className="btn-cta bg-white/15 border-[1.5px] border-white">
              <i className="fa-solid fa-arrow-right"></i> Conoce nuestros servicios
            </Link>
          </div>
        </div>
        <div className="relative hidden md:flex items-center justify-center h-full">
          <img
            src="/images/hero-borca.jpg"
            alt="Comunidad BORCA"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px] rounded-full bg-[rgba(200,169,107,0.12)] pointer-events-none z-0"></div>
      </section>

      {/* PILARES */}
      <section className="bg-white" id="pilares">
        <div className="section-wrap section-pad">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Nuestros pilares</p>
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
              <p>Trabajamos por el crecimiento, la sostenibilidad y la valorización de cada comunidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS PREVIEW */}
      <section className="bg-gray" id="servicios-preview">
        <div className="section-wrap section-pad">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Soluciones integrales</p>
            <h2 className="section-title">
              ¿Qué ofrecemos <span>a nuestros clientes?</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <Link href="/servicios" className="card card-border no-underline cursor-pointer transition-all">
              <div className="card-icon-lg">
                <i className="fa-solid fa-building"></i>
              </div>
              <h3>Administración de PH</h3>
              <p>Gestión integral de copropiedades residenciales, comerciales, mixtas.</p>
              <div className="text-teal font-bold text-[14.5px] mt-3 flex items-center gap-1.5">
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
            <Link href="/servicios" className="card card-border no-underline cursor-pointer transition-all">
              <div className="card-icon-lg">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3>Consultoría PH</h3>
              <p>Acompañamiento técnico, jurídico y administrativo en procesos especializados.</p>
              <div className="text-teal font-bold text-[14.5px] mt-3 flex items-center gap-1.5">
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
            <Link href="/servicios" className="card card-border no-underline cursor-pointer transition-all">
              <div className="card-icon-lg">
                <i className="fa-solid fa-toolbox"></i>
              </div>
              <h3>Servicios Especializados</h3>
              <p>Contabilidad, mantenimiento, facturación, aseo, jardinería, seguros y más a través de alianzas.</p>
              <div className="text-teal font-bold text-[14.5px] mt-3 flex items-center gap-1.5">
                Conocer más <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-gray" id="por-que-elegirnos">
        <div className="section-wrap section-pad">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Nuestra diferencia</p>
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
              <p>Cada copropiedad cuenta con un administrador delegado que comprende su realidad, identifica sus necesidades y lidera una gestión cercana, eficiente y permanente.</p>
            </div>
            <div className="card card-teal">
              <div className="card-icon-lg">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>Enfoque preventivo</h3>
              <p>La prevención es parte de nuestra gestión. Planificamos, supervisamos y actuamos oportunamente para proteger el patrimonio de la copropiedad.</p>
            </div>
          </div>
          <div className="text-center mt-9">
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
