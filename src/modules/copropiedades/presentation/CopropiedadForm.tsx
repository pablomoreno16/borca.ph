"use client";

import { useState, type FormEvent } from "react";
import type { Copropiedad, CopropiedadInput, EstadoCopropiedad } from "../domain/types";

interface Props {
  itemInicial?: Copropiedad;
  onGuardar: (input: CopropiedadInput, id?: string) => Promise<void>;
  onCancelar: () => void;
}

export function CopropiedadForm({ itemInicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(itemInicial?.nombre ?? "");
  const [nit, setNit] = useState(itemInicial?.nit ?? "");
  const [direccion, setDireccion] = useState(itemInicial?.direccion ?? "");
  const [ciudad, setCiudad] = useState(itemInicial?.ciudad ?? "");
  const [telefono, setTelefono] = useState(itemInicial?.telefono ?? "");
  const [cuentaBancaria, setCuentaBancaria] = useState(itemInicial?.cuentaBancaria ?? "");
  const [correo, setCorreo] = useState(itemInicial?.correo ?? "");
  const [estado, setEstado] = useState<EstadoCopropiedad>(itemInicial?.estado ?? "activa");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar(
        {
          nombre,
          nit: nit.trim() ? nit : null,
          direccion: direccion.trim() ? direccion : null,
          ciudad: ciudad.trim() ? ciudad : null,
          telefono: telefono.trim() ? telefono : null,
          cuentaBancaria: cuentaBancaria.trim() ? cuentaBancaria : null,
          correo: correo.trim() ? correo : null,
          estado,
        },
        itemInicial?.id
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la copropiedad.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[560px]">
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
          <label className="block text-sm font-bold mb-1">NIT</label>
          <input
            value={nit}
            onChange={(e) => setNit(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={estado === "activa"}
              onChange={(e) => setEstado(e.target.checked ? "activa" : "inactiva")}
            />
            Activa
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Dirección</label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Ciudad</label>
          <input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Cuenta bancaria</label>
          <input
            value={cuentaBancaria}
            onChange={(e) => setCuentaBancaria(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
      </div>
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
