"use client";

import { Fragment, useState, type FormEvent } from "react";
import type { TipoUnidad, UnidadPrivada, UnidadPrivadaInput } from "../domain/types";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";

interface Props {
  unidad: UnidadPrivada;
  onGuardar: (input: UnidadPrivadaInput) => Promise<void>;
}

export function UnidadForm({ unidad, onGuardar }: Props) {
  // Siempre edita una unidad existente, así que arranca de solo lectura con
  // un botón "Editar" que la habilita — Guardar y Cancelar la vuelven a
  // dejar de solo lectura (Cancelar descarta los cambios sin guardar).
  const [modoEdicion, setModoEdicion] = useState(false);

  const [bloque, setBloque] = useState(unidad.bloque);
  const [identificador, setIdentificador] = useState(unidad.identificador);
  const [tipo, setTipo] = useState<TipoUnidad>(unidad.tipo);
  const [coeficientePorcentaje, setCoeficientePorcentaje] = useState(
    String(Number((unidad.coeficiente * 100).toFixed(6)))
  );
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function resetCampos() {
    setBloque(unidad.bloque);
    setIdentificador(unidad.identificador);
    setTipo(unidad.tipo);
    setCoeficientePorcentaje(String(Number((unidad.coeficiente * 100).toFixed(6))));
  }

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
      setModoEdicion(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la unidad.");
    } finally {
      setGuardando(false);
    }
  }

  function onCancelarClick() {
    resetCampos();
    setError(null);
    setModoEdicion(false);
  }

  const soloLectura = !modoEdicion;

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Bloque</label>
          <input
            required
            disabled={soloLectura}
            value={bloque}
            onChange={(e) => setBloque(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">#</label>
          <input
            required
            disabled={soloLectura}
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Tipo</label>
          <select
            disabled={soloLectura}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoUnidad)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
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
            disabled={soloLectura}
            value={coeficientePorcentaje}
            onChange={(e) => setCoeficientePorcentaje(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        {modoEdicion ? (
          // key distinta a la del botón "Editar" a propósito: sin esto,
          // React reutiliza el mismo <button> del DOM y solo le cambia el
          // atributo type de "button" a "submit" — como el cambio ocurre
          // durante el mismo click, el navegador termina disparando el
          // submit del form sobre ese botón reciclado.
          <Fragment key="editando">
            <button type="submit" disabled={guardando} className="btn-cta bg-gold disabled:opacity-60">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onCancelarClick}
              className="text-sm font-semibold text-text-body hover:underline"
            >
              Cancelar
            </button>
          </Fragment>
        ) : (
          <button key="viendo" type="button" onClick={() => setModoEdicion(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-pen"></i> Editar
          </button>
        )}
      </div>
    </form>
  );
}
