"use client";

import { useState } from "react";
import type { Persona, PropietarioUnidad } from "../domain/types";
import { usePropietariosUnidad } from "../application/usePropietariosUnidad";
import { obtenerPersona } from "../application/obtenerPersona";
import { eliminarPropietario } from "../infrastructure/copropiedadRepository";
import { Modal } from "@/shared/ui/Modal";
import { EditarPropietarioModal } from "./EditarPropietarioModal";

interface Props {
  unidadId: string;
  // El padre puede mostrar datos derivados de los propietarios (ej. el
  // total de % de participación en la página); esto le avisa cuando
  // cambian por una edición o eliminación hecha dentro de esta tabla.
  onCambio?: () => void;
}

export function PropietariosTable({ unidadId, onCambio }: Props) {
  const { propietarios, cargando, refrescar } = usePropietariosUnidad(unidadId);
  const [editando, setEditando] = useState<{ propietario: PropietarioUnidad; persona: Persona } | null>(null);
  const [cargandoEdicionId, setCargandoEdicionId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onEditar(propietario: PropietarioUnidad) {
    setError(null);
    setCargandoEdicionId(propietario.id);
    try {
      const persona = await obtenerPersona(propietario.personaId);
      setEditando({ propietario, persona });
    } catch {
      setError("No se pudo cargar el propietario.");
    } finally {
      setCargandoEdicionId(null);
    }
  }

  async function onEliminar(propietario: PropietarioUnidad) {
    if (!window.confirm(`¿Quitar a ${propietario.nombre} como propietario de esta unidad?`)) return;
    setError(null);
    setEliminandoId(propietario.id);
    try {
      await eliminarPropietario(propietario.id);
      refrescar();
      onCambio?.();
    } catch {
      setError("No se pudo quitar el propietario.");
    } finally {
      setEliminandoId(null);
    }
  }

  if (cargando) return <p className="text-text-body text-sm">Cargando...</p>;

  return (
    <div className="flex flex-col gap-3.5">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {propietarios.length === 0 ? (
        <p className="text-text-body text-sm">Esta unidad todavía no tiene propietarios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#e5e9e8] text-text-body">
                <th className="py-2 pr-3">Propietario</th>
                <th className="py-2 pr-3">% Participación</th>
                <th className="py-2 pr-3">Desde</th>
                <th className="py-2 pr-3">Hasta</th>
                <th className="py-2 pr-3">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {propietarios.map((propietario) => (
                <tr key={propietario.id} className="border-b border-[#eef2f1]">
                  <td className="py-2 pr-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => onEditar(propietario)}
                      disabled={cargandoEdicionId === propietario.id}
                      className="text-teal hover:underline disabled:opacity-60"
                    >
                      {propietario.nombre}
                    </button>
                  </td>
                  <td className="py-2 pr-3 text-text-body">
                    {propietario.porcentajeParticipacion !== null
                      ? `${propietario.porcentajeParticipacion.toFixed(2)}%`
                      : "—"}
                  </td>
                  <td className="py-2 pr-3 text-text-body">{propietario.fechaInicio}</td>
                  <td className="py-2 pr-3 text-text-body">{propietario.fechaFin ?? "Actual"}</td>
                  <td className="py-2 pr-3">
                    <button
                      type="button"
                      onClick={() => onEliminar(propietario)}
                      disabled={eliminandoId === propietario.id}
                      title="Eliminar"
                      aria-label="Eliminar"
                      className="text-red-600 hover:text-red-800 disabled:opacity-60"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <Modal onClose={() => setEditando(null)}>
          <EditarPropietarioModal
            propietarioId={editando.propietario.id}
            persona={editando.persona}
            porcentajeParticipacionActual={editando.propietario.porcentajeParticipacion}
            totalOtrosParticipacion={propietarios
              .filter((p) => p.fechaFin === null && p.id !== editando.propietario.id)
              .reduce((acc, p) => acc + (p.porcentajeParticipacion ?? 0), 0)}
            onGuardado={() => {
              setEditando(null);
              refrescar();
              onCambio?.();
            }}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </div>
  );
}
