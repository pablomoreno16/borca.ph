"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { LoginForm } from "@/modules/auth/presentation/LoginForm";

const ROLES_ADMIN = ["super_admin", "site_owner"] as const;

export default function LoginPage() {
  const router = useRouter();
  const { cargando, sesion } = useSesion();

  useEffect(() => {
    if (cargando || !sesion) return;
    if (tieneAlgunRol(sesion, [...ROLES_ADMIN])) {
      router.replace("/admin/carrusel");
      return;
    }
    // Futuro: portal de copropietarios/residentes. Todavía no existe una
    // ruta a la que redirigir a un usuario sin rol administrativo.
  }, [cargando, sesion, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-16">
      <h1 className="font-serif text-[28px] font-bold text-teal mb-6">Acceder</h1>
      <LoginForm />
    </div>
  );
}
