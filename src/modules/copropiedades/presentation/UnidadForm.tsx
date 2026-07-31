"use client";

import { useState, type FormEvent } from "react";
import type { TipoUnidad, UnidadPrivada, UnidadPrivadaInput } from "../domain/types";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";

interface Props {
  unidad: UnidadPrivada;
  onGuardar: (input: UnidadPrivadaInput) => Promise<void>;
  onCancelar: () => void;
}

export function UnidadForm({ unidad, onGuardar, onCancelar }: Props) {
  const [bloque, setBloque] = useState(unidad.bloque);
  const [identificador, setIdentificador] = useState(unidad.identificador);
  const [tipo, setTipo] = useState<TipoUnidad>(unidad.tipo);
  const [coeficientePorcentaje, setCoeficientePorcentaje] = useState(
    String(Number((unidad.coeficiente * 100).toFixed(6)))
  );
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar({
        bloque,
        identificador,
        tipo,
        coeficiente: Number(coeficientePorcentaje) / 100,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la unidad.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      {unidad.propietarioNombre && (
        <p className="text-sm text-text-body">
          <i className="fa-solid fa-user"></i> Propietario: <strong>{unidad.propietarioNombre}</strong>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Bloque</label>
          <input
            required
            value={bloque}
            onChange={(e) => setBloque(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">#</label>
          <input
            required
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoUnidad)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          >
            {Object.entries(TIPO_UNIDAD_LABEL).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Coeficiente (%)</label>
          <input
            required
            type="number"
            step="0.0001"
            min="0"
            value={coeficientePorcentaje}
            onChange={(e) => setCoeficientePorcentaje(e.target.value)}
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
