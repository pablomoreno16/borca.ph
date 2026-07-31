"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-teal">Panel administrativo</h1>
      <p className="text-text-body">Bienvenido al panel de BORCA.</p>
      <Link href="/admin/carrusel" className="card card-border bg-white max-w-[320px] no-underline block">
        <h3>Carrusel de novedades</h3>
        <p className="text-sm text-text-body">Gestiona las promociones, eventos y anuncios del sitio.</p>
      </Link>
    </div>
  );
}
