"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { obtenerUnidad, eliminarUnidad } from "@/modules/copropiedades/infrastructure/copropiedadRepository";
import { guardarUnidad } from "@/modules/copropiedades/application/guardarUnidad";
import { UnidadForm } from "@/modules/copropiedades/presentation/UnidadForm";
import type { UnidadPrivada, UnidadPrivadaInput } from "@/modules/copropiedades/domain/types";

// Ruta estática con el id como query param (ver detalle/page.tsx: output:
// 'export' no permite segmentos dinámicos [id] para ids creados en runtime).
export default function AdminUnidadDetallePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin/carrusel");
  }, [cargandoSesion, autorizado, router]);

  const [unidad, setUnidad] = useState<UnidadPrivada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (!autorizado || !id) return;
    let activo = true;
    obtenerUnidad(id)
      .then((u) => {
        if (activo) setUnidad(u);
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar la unidad.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [id, autorizado]);

  async function onGuardar(input: UnidadPrivadaInput) {
    if (!id) return;
    const actualizada = await guardarUnidad(id, input);
    setUnidad(actualizada);
  }

  async function onEliminar() {
    if (!id || !unidad) return;
    if (!window.confirm(`¿Eliminar la unidad ${unidad.identificador}? Esta acción no se puede deshacer.`)) return;
    setEliminando(true);
    try {
      await eliminarUnidad(id);
      router.push(`/admin/copropiedades/detalle?id=${unidad.copropiedadId}`);
    } catch {
      setError("No se pudo eliminar la unidad.");
      setEliminando(false);
    }
  }

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  if (!id) {
    return <p className="text-red-600">Falta el identificador de la unidad.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {unidad && (
        <Link
          href={`/admin/copropiedades/detalle?id=${unidad.copropiedadId}`}
          className="text-sm text-teal font-semibold hover:underline w-fit"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a la copropiedad
        </Link>
      )}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {unidad && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-serif text-2xl font-bold text-teal">Unidad {unidad.identificador}</h1>
            <button
              type="button"
              onClick={onEliminar}
              disabled={eliminando}
              className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-60"
            >
              <i className="fa-solid fa-trash"></i> {eliminando ? "Eliminando..." : "Eliminar unidad"}
            </button>
          </div>

          <UnidadForm
            unidad={unidad}
            onGuardar={onGuardar}
            onCancelar={() => router.push(`/admin/copropiedades/detalle?id=${unidad.copropiedadId}`)}
          />
        </>
      )}
    </div>
  );
}
