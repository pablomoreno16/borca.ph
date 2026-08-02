"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { obtenerUnidad, eliminarUnidad } from "@/modules/copropiedades/infrastructure/copropiedadRepository";
import { guardarUnidad } from "@/modules/copropiedades/application/guardarUnidad";
import { useSumaParticipacion } from "@/modules/copropiedades/application/useSumaParticipacion";
import { UnidadForm } from "@/modules/copropiedades/presentation/UnidadForm";
import { PropietariosTable } from "@/modules/copropiedades/presentation/PropietariosTable";
import { AgregarPropietarioModal } from "@/modules/copropiedades/presentation/AgregarPropietarioModal";
import { Modal } from "@/shared/ui/Modal";
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
  const [menuPropietarioAbierto, setMenuPropietarioAbierto] = useState(false);
  const [modalPropietario, setModalPropietario] = useState<"nuevo" | "existente" | null>(null);
  // Fuerza a PropietariosTable y a la suma de participación a volver a
  // consultar tras agregar uno nuevo (mismo patrón que refrescarUnidades
  // en detalle/page.tsx).
  const [refrescarPropietarios, setRefrescarPropietarios] = useState(0);
  const sumaParticipacion = useSumaParticipacion(id ?? "", refrescarPropietarios);

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

          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3.5">
              <h2 className="font-serif text-xl font-bold text-teal">Propietarios</h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuPropietarioAbierto((v) => !v)}
                  className="btn-cta bg-gold"
                >
                  <i className="fa-solid fa-user-plus"></i> Agregar propietario{" "}
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                {menuPropietarioAbierto && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuPropietarioAbierto(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-[8px] border border-[#d8dedd] bg-white shadow-lg z-20 flex flex-col overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setModalPropietario("nuevo");
                          setMenuPropietarioAbierto(false);
                        }}
                        className="px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-[#f4f7f6]"
                      >
                        Nuevo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModalPropietario("existente");
                          setMenuPropietarioAbierto(false);
                        }}
                        className="px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-[#f4f7f6] border-t border-[#eef2f1]"
                      >
                        Existente
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm font-semibold text-text-body mb-3.5">
              Total % de participación: {(sumaParticipacion ?? 0).toFixed(2)}%
            </p>
            <PropietariosTable
              key={refrescarPropietarios}
              unidadId={unidad.id}
              onCambio={() => setRefrescarPropietarios((n) => n + 1)}
            />
          </div>

          {modalPropietario && (
            <Modal onClose={() => setModalPropietario(null)}>
              <AgregarPropietarioModal
                modo={modalPropietario}
                unidadId={unidad.id}
                totalActualParticipacion={sumaParticipacion ?? 0}
                onAgregado={() => {
                  setModalPropietario(null);
                  setRefrescarPropietarios((n) => n + 1);
                }}
                onCancelar={() => setModalPropietario(null)}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
