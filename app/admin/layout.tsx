"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { cerrarSesion } from "@/modules/auth/infrastructure/authRepository";

const ROLES_CON_ACCESO_ADMIN = ["super_admin", "site_owner"] as const;

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/carrusel",
    label: "Carrusel de novedades",
    icon: "fa-solid fa-images",
    roles: ["super_admin", "site_owner"],
  },
  {
    href: "/admin/copropiedades",
    label: "Copropiedades",
    icon: "fa-solid fa-building",
    roles: ["super_admin"],
  },
  {
    href: "/admin/documentos",
    label: "Documentos",
    icon: "fa-solid fa-folder-open",
    roles: ["super_admin"],
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    icon: "fa-solid fa-users",
    roles: ["super_admin"],
  },
] as const;

const stripTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { cargando, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, [...ROLES_CON_ACCESO_ADMIN]);

  useEffect(() => {
    if (cargando) return;
    if (!autorizado) router.replace("/login");
  }, [cargando, autorizado, router]);

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
      <header className="fixed inset-x-0 top-0 z-30 h-16 bg-white border-b border-[#e5e9e8] px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/images/logo-borca.png" alt="BORCA" className="h-9 w-auto object-contain" />
          <span className="font-serif font-bold text-teal">Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-body">{sesion?.email}</span>
          <button type="button" onClick={() => cerrarSesion()} className="text-teal font-semibold hover:underline">
            Cerrar sesión
          </button>
        </div>
      </header>
      <aside className="group/sidebar fixed left-0 top-16 bottom-0 z-20 w-16 hover:w-64 bg-teal-dark transition-[width] duration-200 ease-in-out overflow-hidden">
        <nav className="flex flex-col gap-1 py-5">
          {ADMIN_NAV_ITEMS.filter((item) => tieneAlgunRol(sesion, [...item.roles])).map((item) => {
            const activo = pathnameNormalizado === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3.5 h-11 px-[22px] whitespace-nowrap no-underline transition-colors ${
                  activo ? "bg-white/10 text-gold" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <i className={`${item.icon} text-[18px] w-5 text-center shrink-0`}></i>
                <span className="text-sm font-semibold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="pl-16 pt-16 max-w-[1300px] flex flex-col min-h-screen">
        <div className="py-9 px-9 max-md:px-5 flex-1">{children}</div>
      </main>
    </div>
  );
}
