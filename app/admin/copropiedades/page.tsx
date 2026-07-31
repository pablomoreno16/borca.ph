"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { useCopropiedades } from "@/modules/copropiedades/application/useCopropiedades";
import { guardarCopropiedad } from "@/modules/copropiedades/application/guardarCopropiedad";
import { CopropiedadTable } from "@/modules/copropiedades/presentation/CopropiedadTable";
import { CopropiedadForm } from "@/modules/copropiedades/presentation/CopropiedadForm";
import type { CopropiedadInput } from "@/modules/copropiedades/domain/types";

export default function AdminCopropiedadesPage() {
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin/carrusel");
  }, [cargandoSesion, autorizado, router]);

  const { items, cargando, error, recargar } = useCopropiedades();
  const [creando, setCreando] = useState(false);

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  async function onGuardar(input: CopropiedadInput) {
    await guardarCopropiedad(input);
    setCreando(false);
    await recargar();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-teal">Copropiedades</h1>
        {!creando && (
          <button type="button" onClick={() => setCreando(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-plus"></i> Nueva copropiedad
          </button>
        )}
      </div>

      {creando && <CopropiedadForm onGuardar={onGuardar} onCancelar={() => setCreando(false)} />}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && !creando && <CopropiedadTable items={items} />}
    </div>
  );
}
