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
          <div className="text-center mb-11">
            <p className="section-label justify-center">¿En qué podemos ayudarte?</p>
            <h2 className="section-title">
              Elige tu motivo <span>de consulta</span>
            </h2>
          </div>
          <div className="cards-grid-2 max-w-[900px] mx-auto">
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[18px] bg-white rounded-card p-[22px_20px] shadow-card border-[1.5px] border-[#e8eeed] no-underline transition-all"
            >
              <div className="w-14 h-14 min-w-14 rounded-[14px] bg-card-green flex items-center justify-center text-[22px] text-teal">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-[16.5px] font-extrabold text-text-dark mb-[5px]">Administración de PH</h3>
                <p className="text-sm text-text-body leading-[1.55]">
                  Quiero contratar administración profesional para mi copropiedad.
                </p>
              </div>
              <div className="text-[22px] text-[#25D366] shrink-0">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
            </a>
            <a
              href="https://wa.me/573053498787?text=Hola+BORCA%2C+necesito+asesor%C3%ADa+jur%C3%ADdica+o+de+gesti%C3%B3n+especializada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[18px] bg-white rounded-card p-[22px_20px] shadow-card border-[1.5px] border-[#e8eeed] no-underline transition-all"
            >
              <div className="w-14 h-14 min-w-14 rounded-[14px] bg-card-beige flex items-center justify-center text-[22px] text-[#a07840]">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-[16.5px] font-extrabold text-text-dark mb-[5px]">Consultoría PH</h3>
                <p className="text-sm text-text-body leading-[1.55]">
                  Necesito asesoría jurídica o de gestión especializada.
                </p>
              </div>
              <div className="text-[22px] text-[#25D366] shrink-0">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
