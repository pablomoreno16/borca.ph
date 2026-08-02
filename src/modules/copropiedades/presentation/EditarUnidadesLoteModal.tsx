"use client";

import { useState, type FormEvent } from "react";
import type { CambiosUnidadEnLote, TipoUnidad } from "../domain/types";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";
import { guardarEdicionLoteUnidades } from "../application/guardarEdicionLoteUnidades";

interface Props {
  unidadIds: string[];
  onGuardado: () => void;
  onCancelar: () => void;
}

export function EditarUnidadesLoteModal({ unidadIds, onGuardado, onCancelar }: Props) {
  const [tipo, setTipo] = useState<TipoUnidad | "">("");
  const [coeficientePorcentaje, setCoeficientePorcentaje] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const cambios: CambiosUnidadEnLote = {};
      if (tipo) cambios.tipo = tipo;
      if (coeficientePorcentaje.trim()) cambios.coeficiente = Number(coeficientePorcentaje) / 100;

      await guardarEdicionLoteUnidades(unidadIds, cambios);
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar las unidades.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[420px]">
      <div>
        <h3 className="font-bold">
          Editar {unidadIds.length} unidad{unidadIds.length === 1 ? "" : "es"} seleccionada
          {unidadIds.length === 1 ? "" : "s"}
        </h3>
        <p className="text-sm text-text-body">Deja en blanco los campos que no quieras cambiar.</p>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoUnidad | "")}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        >
          <option value="">No cambiar</option>
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
          type="number"
          step="0.0001"
          min="0"
          placeholder="No cambiar"
          value={coeficientePorcentaje}
          onChange={(e) => setCoeficientePorcentaje(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="btn-cta bg-gold disabled:opacity-60">
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
