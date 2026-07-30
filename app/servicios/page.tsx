import type { Metadata } from "next";

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-18">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-card-green flex items-center justify-center text-[26px] text-teal mb-5">
                <i className="fa-solid fa-building"></i>
              </div>
              <p className="section-label">01</p>
              <h2 className="section-title text-[28px]">
                Administración de
                <br />
                <span>Propiedad Horizontal</span>
              </h2>
              <p className="text-[15px] text-text-body leading-[1.8] mb-6">
                Gerencia integral de copropiedades residenciales, comerciales, mixtas,
                corporativas e industriales, mediante planes de trabajo diseñados según las
                necesidades específicas de cada comunidad.
              </p>
              <h4 className="text-[15.5px] font-extrabold mb-3.5">Nuestra gestión está enfocada en:</h4>
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
            <div className="bg-card-green rounded-card p-9 flex flex-col gap-3.5">
              <div className="card card-border bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-file-invoice-dollar text-teal text-xl"></i>
                  <strong className="text-[14.5px]">Informes financieros detallados</strong>
                </div>
                <p className="text-sm text-text-body leading-[1.6]">
                  Estados de cuenta precisos con todos los movimientos económicos.
                </p>
              </div>
              <div className="card card-border bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-mobile-screen text-teal text-xl"></i>
                  <strong className="text-[14.5px]">Portal digital para propietarios</strong>
                </div>
                <p className="text-sm text-text-body leading-[1.6]">
                  Acceso en línea a recibos, actas y comunicados.
                </p>
              </div>
              <div className="card card-border bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-headset text-teal text-xl"></i>
                  <strong className="text-[14.5px]">Atención disponible</strong>
                </div>
                <p className="text-sm text-text-body leading-[1.6]">
                  Comunicación constante y respuesta rápida a consultas.
                </p>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* SERVICIO 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-18">
            <div className="bg-card-beige rounded-card p-9 order-2">
              <h4 className="text-[14.5px] font-extrabold mb-[18px]">Servicios incluidos:</h4>
              <div className="flex flex-col gap-3">
                <div className="card card-border bg-white py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-gavel text-[#a07840] text-lg"></i>
                    <span className="text-sm font-bold">Interpretación Ley 675</span>
                  </div>
                </div>
                <div className="card card-border bg-white py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-file-contract text-[#a07840] text-lg"></i>
                    <span className="text-sm font-bold">Elaboración y reforma de reglamentos</span>
                  </div>
                </div>
                <div className="card card-border bg-white py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-people-group text-[#a07840] text-lg"></i>
                    <span className="text-sm font-bold">Mediación de conflictos</span>
                  </div>
                </div>
                <div className="card card-border bg-white py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-magnifying-glass text-[#a07840] text-lg"></i>
                    <span className="text-sm font-bold">Diagnóstico de gestión</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1">
              <div className="w-16 h-16 rounded-2xl bg-card-beige flex items-center justify-center text-[26px] text-[#a07840] mb-5">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <p className="section-label">02</p>
              <h2 className="section-title text-[28px]">
                Consultoría <span>PH</span>
              </h2>
              <p className="text-[15px] text-text-body leading-[1.8] mb-5">
                Contamos con aliados especializados en Propiedad Horizontal para brindar
                acompañamiento técnico, jurídico y administrativo en procesos complejos de
                gestión de copropiedades.
              </p>
            </div>
          </div>

          <div className="divider"></div>

          {/* SERVICIO 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-card-blue flex items-center justify-center text-[26px] text-[#1a5fa8] mb-5">
                <i className="fa-solid fa-toolbox"></i>
              </div>
              <p className="section-label">03</p>
              <h2 className="section-title text-[28px]">
                Servicios <span>Especializados</span>
              </h2>
              <p className="text-[15px] text-text-body leading-[1.8] mb-6">
                A través de nuestras alianzas estratégicas ofrecemos servicios complementarios
                que fortalecen la operación y sostenibilidad de las copropiedades.
              </p>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Contabilidad y cartera</strong>
                  <p>Gestión completa de cuentas y cobro de cuotas morosas.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Mantenimiento locativo</strong>
                  <p>Reparación y mantenimiento preventivo de infraestructuras.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Aseo, jardinería y seguridad</strong>
                  <p>Servicios operativos continuos para bienes comunes.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Seguros y asesoría legal</strong>
                  <p>Cobertura de riesgos y acompañamiento jurídico especializado.</p>
                </div>
              </div>
            </div>
            <div className="bg-card-blue rounded-card p-9 text-center">
              <i className="fa-solid fa-handshake text-[56px] text-[#1a5fa8] opacity-40 mb-5 block"></i>
              <h3 className="text-lg font-extrabold mb-3">Red de aliados certificados</h3>
              <p className="text-[14.5px] text-text-body leading-[1.8]">
                Proveedores verificados en todas las áreas para garantizar calidad en cada
                servicio contratado.
              </p>
              <div className="flex gap-2 flex-wrap justify-center mt-5">
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Vigilancia
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Mantenimiento
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Jardinería
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Contabilidad
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
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
        <a
          href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
        >
          <i className="fa-solid fa-paper-plane"></i> Solicita tu propuesta
        </a>
      </section>
    </>
  );
}
