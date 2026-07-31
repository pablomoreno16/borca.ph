import { ButterflyIcon } from "@/shared/ui/ButterflyIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Por qué elegirnos? – BORCA",
};

// Pendiente: los testimonios son datos dummy. Se ocultan hasta tener
// testimonios reales de clientes. Reactivar cambiando esto a true.
const TESTIMONIOS_HABILITADOS = false;

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
            Porque entendemos que administrar una copropiedad es gestionar su patrimonio, fortalecer
            su funcionamiento y generar confianza. En BORCA lo hacemos con compromiso, transparencia
            y un acompañamiento cercano en cada decisión.
          </p>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Lo que nos hace únicos</p>
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
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-people-roof"></i>
              </div>
              <h3>Atención personalizada</h3>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>Enfoque preventivo</h3>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Red de aliados expertos</h3>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <h3>Respuesta oportuna</h3>
            </div>
            <div className="card card-gray">
              <div className="card-icon-lg">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Vocación de servicio</h3>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      {TESTIMONIOS_HABILITADOS && (
      <section className="bg-gray">
        <div className="section-wrap section-pad">
          <div className="text-center mb-11">
            <p className="section-label justify-center">Lo que dicen nuestros clientes</p>
            <h2 className="section-title">
              Testimonios <span>reales</span>
            </h2>
          </div>
          <div className="cards-grid-3">
            <div className="card card-border">
              <div className="flex gap-[3px] text-gold mb-3.5 text-sm">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-[14.5px] text-text-body leading-[1.75] mb-[18px] italic">
                &quot;BORCA transformó la organización financiera de nuestra copropiedad. Ahora
                sabemos exactamente en qué se gasta cada peso.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-extrabold text-[15px]">
                  C
                </div>
                <div>
                  <strong className="text-[14.5px] block">Cliente Copropiedad</strong>
                  <span className="text-xs text-[#999]">Medellín, Antioquia</span>
                </div>
              </div>
            </div>
            <div className="card card-border">
              <div className="flex gap-[3px] text-gold mb-3.5 text-sm">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-[14.5px] text-text-body leading-[1.75] mb-[18px] italic">
                &quot;La comunicación y el acompañamiento han sido excelentes. Sentimos que
                realmente nos entienden.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-extrabold text-[15px]">
                  J
                </div>
                <div>
                  <strong className="text-[14.5px] block">Junta Directiva</strong>
                  <span className="text-xs text-[#999]">Bogotá, Cundinamarca</span>
                </div>
              </div>
            </div>
            <div className="card card-border">
              <div className="flex gap-[3px] text-gold mb-3.5 text-sm">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-[14.5px] text-text-body leading-[1.75] mb-[18px] italic">
                &quot;BORCA transformó por completo la cultura de nuestra copropiedad. Ahora es un
                mejor lugar para vivir.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a5fa8] flex items-center justify-center text-white font-extrabold text-[15px]">
                  P
                </div>
                <div>
                  <strong className="text-[14.5px] block">Propietario</strong>
                  <span className="text-xs text-[#999]">Cali, Valle del Cauca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* PROCESO */}
      <section className="bg-white">
        <div className="section-wrap section-pad">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Cómo trabajamos</p>
            <h2 className="section-title">
              Proceso de <span>vinculación en 3 pasos</span>
            </h2>
            <p className="text-text-body text-[16.5px] max-w-[520px] mx-auto leading-[1.8]">
              Vincularse a BORCA es simple, rápido y sin complicaciones. Te acompañamos en cada
              paso.
            </p>
          </div>
          {/* nota: el sitio original no envolvía estas 3 tarjetas en cards-grid-3 (bug visual corregido en esta migración) */}
          <div className="cards-grid-3">
            <div className="card card-border text-center">
              <div className="font-serif text-[42px] font-bold text-gold opacity-25 leading-none -mb-1">01</div>
              <div className="card-icon-lg mx-auto mb-3.5">
                <i className="fa-solid fa-file-signature"></i>
              </div>
              <h3 className="text-[16.5px]">Propuesta personalizada</h3>
              <p className="text-sm">Plan diseñado según necesidades de tu conjunto.</p>
            </div>
            <div className="card card-border text-center">
              <div className="font-serif text-[42px] font-bold text-gold opacity-25 leading-none -mb-1">02</div>
              <div className="card-icon-lg mx-auto mb-3.5">
                <i className="fa-solid fa-people-group"></i>
              </div>
              <h3 className="text-[16.5px]">Presentación a asamblea o consejo de administración</h3>
              <p className="text-sm">Acompañamos la presentación para aprobación en caso de ser requerida.</p>
            </div>
            <div className="card card-border text-center">
              <div className="font-serif text-[42px] font-bold text-gold opacity-25 leading-none -mb-1">03</div>
              <div className="card-icon-lg mx-auto mb-3.5">
                <i className="fa-solid fa-rocket"></i>
              </div>
              <h3 className="text-[16.5px]">Inicio de operaciones</h3>
              <p className="text-sm">Transición ordenada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
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
