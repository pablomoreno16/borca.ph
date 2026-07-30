"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/por-que-elegirnos", label: "¿Por qué elegirnos?" },
  { href: "/contacto", label: "Contacto" },
];

// Con trailingSlash:true las URLs reales terminan en "/" (ej. "/servicios/"),
// así que se normaliza antes de comparar contra NAV_LINKS.
const stripTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

export function Header() {
  const pathname = stripTrailingSlash(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;
    const onScroll = () => {
      navbar.style.boxShadow =
        window.scrollY > 10 ? "0 4px 22px rgba(0,0,0,0.11)" : "0 2px 14px rgba(0,0,0,0.08)";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="navbar" ref={navbarRef}>
      <div className={`navbar-inner${menuOpen ? " menu-open" : ""}`}>
        <Link href="/" className="nav-logo">
          <img src="/images/logo-borca.png" alt="BORCA" className="logo-img" />
        </Link>
        <button
          className="nav-toggle"
          id="navToggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="navCollapse"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
        <div className="nav-collapse" id="navCollapse">
          <nav className="nav-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
