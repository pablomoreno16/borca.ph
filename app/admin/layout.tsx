"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { cerrarSesion } from "@/modules/auth/infrastructure/authRepository";

const ROLES_CON_ACCESO_ADMIN = ["super_admin", "site_owner"] as const;

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/carrusel", label: "Carrusel de novedades" },
];

const stripTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const enLogin = pathname === "/admin/login" || pathname === "/admin/login/";
  const { cargando, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, [...ROLES_CON_ACCESO_ADMIN]);

  useEffect(() => {
    if (cargando) return;
    if (enLogin) {
      if (autorizado) router.replace("/admin");
      return;
    }
    if (!autorizado) router.replace("/admin/login");
  }, [cargando, enLogin, autorizado, router]);

  if (enLogin) {
    // La página de login se muestra sin el shell del panel, incluso
    // mientras se verifica si ya hay una sesión válida.
    return <>{children}</>;
  }

  if (cargando || !autorizado) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-text-body">
        Verificando sesión...
      </div>
    );
  }

  const pathnameNormalizado = stripTrailingSlash(pathname);

  return (
    <div className="min-h-screen bg-gray">
      <header className="bg-white border-b border-[#e5e9e8]">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <span className="font-serif font-bold text-teal">BORCA · Admin</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-body">{sesion?.email}</span>
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="text-teal font-semibold hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="px-5 flex items-center gap-5 border-t border-[#eef2f1]">
          {ADMIN_NAV_LINKS.map((link) => {
            const activo = pathnameNormalizado === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold py-3 border-b-2 no-underline ${
                  activo ? "text-teal border-teal" : "text-text-body border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="section-wrap py-9 px-5">{children}</main>
    </div>
  );
}
