import Link from "next/link";

export function Footer() {
  return (
    <footer className="page-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img
            src="/images/logo-borca.png"
            alt="BORCA"
            className="w-[130px] h-auto object-contain mb-3.5"
          />
          <p>
            Transformamos copropiedades en comunidades organizadas, sostenibles y tranquilas
            mediante una administración estratégica, humana y eficiente.
          </p>
        </div>
        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/quienes-somos">Quiénes somos</Link>
            </li>
            <li>
              <Link href="/servicios">Servicios</Link>
            </li>
            <li>
              <Link href="/por-que-elegirnos">¿Por qué elegirnos?</Link>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Servicios</h4>
          <ul>
            <li>
              <Link href="/servicios">Administración PH</Link>
            </li>
            <li>
              <Link href="/servicios">Consultoría PH</Link>
            </li>
            <li>
              <Link href="/servicios">Servicios Especializados</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li>
              <i className="fa-solid fa-location-dot"></i> Medellín, Colombia
            </li>
            <li>
              <a
                href="https://wa.me/573053498787?text=Hola+BORCA%2C+me+interesa+el+servicio+de+Administraci%C3%B3n+de+PH"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-phone"></i> +57 305 349 8787
              </a>
            </li>
            <li>
              <a href="mailto:admin@borca.ph">
                <i className="fa-solid fa-envelope"></i> admin@borca.ph
              </a>
            </li>
            <li>
              <i className="fa-solid fa-globe"></i> borca.ph
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 BORCA. Todos los derechos reservados.</p>
        <div className="footer-social">
          <a href="#" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#" aria-label="TikTok">
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
