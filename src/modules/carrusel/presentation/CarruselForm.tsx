"use client";

import { useState, type FormEvent } from "react";
import type { CarruselItem, CarruselItemInput, TipoCarrusel } from "../domain/types";

const TIPOS: { value: TipoCarrusel; label: string }[] = [
  { value: "promocion", label: "Promoción" },
  { value: "evento", label: "Evento" },
  { value: "anuncio", label: "Anuncio" },
];

interface Props {
  itemInicial?: CarruselItem;
  siguienteOrden: number;
  onGuardar: (input: CarruselItemInput, id?: string) => Promise<void>;
  onCancelar: () => void;
}

export function CarruselForm({ itemInicial, siguienteOrden, onGuardar, onCancelar }: Props) {
  const [titulo, setTitulo] = useState(itemInicial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(itemInicial?.descripcion ?? "");
  const [tipo, setTipo] = useState<TipoCarrusel>(itemInicial?.tipo ?? "anuncio");
  const [activo, setActivo] = useState(itemInicial?.activo ?? true);
  const [fechaInicio, setFechaInicio] = useState(itemInicial?.fechaInicio ?? "");
  const [fechaFin, setFechaFin] = useState(itemInicial?.fechaFin ?? "");
  const [ctaLabel, setCtaLabel] = useState(itemInicial?.ctaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(itemInicial?.ctaHref ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar(
        {
          titulo,
          descripcion: descripcion.trim() ? descripcion : null,
          tipo,
          orden: itemInicial?.orden ?? siguienteOrden,
          activo,
          fechaInicio: fechaInicio || null,
          fechaFin: fechaFin || null,
          ctaLabel: ctaLabel.trim() ? ctaLabel : null,
          ctaHref: ctaHref.trim() ? ctaHref : null,
        },
        itemInicial?.id
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el ítem.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[560px]">
      <div>
        <label className="block text-sm font-bold mb-1">Título</label>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCarrusel)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Activo
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Vigente desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Vigente hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Texto del botón (opcional)</label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Sin botón si se deja vacío"
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Destino del botón (opcional)</label>
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="/contacto o www.ejemplo.com"
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
