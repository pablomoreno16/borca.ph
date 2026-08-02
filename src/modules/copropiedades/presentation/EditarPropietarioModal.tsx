"use client";

import { useState, type FormEvent } from "react";
import type { Persona } from "../domain/types";
import { editarPropietario } from "../application/editarPropietario";

const TIPOS_DOCUMENTO = ["CC", "CE", "NIT", "Pasaporte", "TI"];

interface Props {
  propietarioId: string;
  persona: Persona;
  porcentajeParticipacionActual: number | null;
  // Suma de % de los demás propietarios activos (sin contar este) — para
  // mostrar el total en vivo mientras se edita, igual que al agregar uno.
  totalOtrosParticipacion: number;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function EditarPropietarioModal({
  propietarioId,
  persona,
  porcentajeParticipacionActual,
  totalOtrosParticipacion,
  onGuardado,
  onCancelar,
}: Props) {
  const [tipoDocumento, setTipoDocumento] = useState(persona.tipoDocumento ?? TIPOS_DOCUMENTO[0]);
  const [numeroDocumento, setNumeroDocumento] = useState(persona.numeroDocumento ?? "");
  const [nombre, setNombre] = useState(persona.nombre);
  const [correo, setCorreo] = useState(persona.correo ?? "");
  const [telefono, setTelefono] = useState(persona.telefono ?? "");
  const [porcentaje, setPorcentaje] = useState(String(porcentajeParticipacionActual ?? ""));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const porcentajeNumero = Number(porcentaje) || 0;
  const totalConEste = totalOtrosParticipacion + porcentajeNumero;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await editarPropietario(
        propietarioId,
        persona.id,
        {
          tipoDocumento: tipoDocumento.trim() ? tipoDocumento : null,
          numeroDocumento: numeroDocumento.trim() ? numeroDocumento.trim() : null,
          nombre,
          correo: correo.trim() ? correo : null,
          telefono: telefono.trim() ? telefono : null,
        },
        Number(porcentaje) || 0
      );
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el propietario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[420px]">
      <h3 className="font-bold">Editar propietario</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Tipo de documento</label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          >
            {TIPOS_DOCUMENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Número de documento</label>
          <input
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Nombre</label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Teléfono</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">% de participación en esta unidad</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <p className="text-sm text-text-body">
        % de participación total de la unidad: <strong>{totalConEste.toFixed(2)}%</strong>
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="btn-cta bg-gold disabled:opacity-60">
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
