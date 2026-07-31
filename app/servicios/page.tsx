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
            Soluciones integrales 
            <br />
            <span>para tu copropiedad</span>
          </h1>
          <p>
            Ponemos a su disposición un portafolio de servicios diseñado para atender las
            necesidades administrativas, financieras, operativas, legales y de mantenimiento
            de copropiedades residenciales, comerciales y mixtas.
          </p>
          <p>
            Ofrecemos un servicio integral, respaldado por procesos especializados y soluciones
            adaptadas a las necesidades de cada copropiedad.
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
                Gerencia integral de copropiedades residenciales, comerciales y mixtas,
                mediante planes de trabajo diseñados según las necesidades específicas
                de cada copropiedad.
              </p>
              <h4 className="text-[15.5px] font-extrabold mb-3.5">Nuestra gestión está enfocada en:</h4>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Recuperación de cartera</strong>
                  <p>
                    Implementación de estrategias de cobro preventivo, persuasivo, prejurídico y jurídico para
                    fortalecer el recaudo y garantizar el adecuado funcionamiento de la copropiedad.
                  </p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Optimización financiera</strong>
                  <p>
                    Elaboración de informes financieros claros y detallados, acompañados de un
                    seguimiento permanente al presupuesto, para facilitar la toma de decisiones y
                    el control eficiente de los recursos de la copropiedad.
                  </p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Control administrativo</strong>
                  <p>Gestión integral de los procesos administrativos, documentales y legales de la
                    copropiedad, incluyendo el seguimiento a contratos, pólizas de seguros, obligaciones
                    normativas y cumplimiento de la Ley 675 de 2001, para garantizar el correcto funcionamiento
                    y la sostenibilidad de la copropiedad.
                  </p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Mantenimientos</strong>
                  <p>
                    Planificación, coordinación y supervisión del mantenimiento preventivo de las áreas
                    y bienes comunes, prolongando su vida útil, reduciendo costos y previniendo fallas.
                  </p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Seguridad y convivencia</strong>
                  <p>
                    Promoción de entornos seguros y armónicos mediante campañas de cultura ciudadana, estrategias
                    preventivas, el cumplimiento del Reglamento de Propiedad Horizontal y el Manual de Convivencia.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card-green rounded-card p-9 flex flex-col gap-3.5">
              <div className="card card-border bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-file-invoice-dollar text-teal text-xl"></i>
                  <strong className="text-[14.5px]">Administrador delegado</strong>
                </div>
                <p className="text-sm text-text-body leading-[1.6]">
                  Acompañamiento permanente por un profesional que conoce las necesidades de su copropiedad y lidera su gestión.
                </p>
              </div>
              <div className="card card-border bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-mobile-screen text-teal text-xl"></i>
                  <strong className="text-[14.5px]">Portal digital para propietarios</strong>
                </div>
                <p className="text-sm text-text-body leading-[1.6]">
                  Acceso en línea a RPH, manual de convivencia, facturación, recibos, actas, estados financieros, reservas de zonas comunes y comunicados.
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
                    <span className="text-sm font-bold">Interpretación de la Ley 675 de 2001</span>
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
                  <p>Administración contable, gestión financiera, elaboración de estados financieros, proyectos de presupuesto y facturación.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Mantenimiento locativo</strong>
                  <p>Mantenimiento preventivo y correctivo de las instalaciones, reparaciones locativas y conservación de las áreas comunes.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Aseo, jardinería y seguridad</strong>
                  <p>Servicios operativos que garantizan espacios limpios, seguros y en óptimas condiciones.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Seguros</strong>
                  <p>Asesoría en la contratación, renovación y administración de pólizas, acompañamiento en reclamaciones y gestión de siniestros.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-dot bg-[#1a5fa8]">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div>
                  <strong>Asesoría legal</strong>
                  <p>
                    Acompañamiento jurídico especializado, recuperación de cartera de difícil cobro, representación en procesos judiciales y 
                    extrajudiciales, elaboración y revisión de documentos legales y atención de consultas en materia civil, laboral y administrativa.
                  </p>
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
                  Mantenimiento y aseo
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
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Asesoría jurídica
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  SG-SST
                </span>
                <span className="bg-white rounded-full py-[5px] px-3 text-xs font-bold text-[#1a5fa8]">
                  Proyectos de infraestructura
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
