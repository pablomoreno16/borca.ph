"use client";

import type { CarruselItem } from "../domain/types";

interface Props {
  items: CarruselItem[];
  onEditar: (item: CarruselItem) => void;
  onEliminar: (item: CarruselItem) => void;
  onMover: (item: CarruselItem, direccion: "arriba" | "abajo") => void;
}

const TIPO_LABEL: Record<CarruselItem["tipo"], string> = {
  promocion: "Promoción",
  evento: "Evento",
  anuncio: "Anuncio",
};

export function CarruselTable({ items, onEditar, onEliminar, onMover }: Props) {
  if (items.length === 0) {
    return <p className="text-text-body">Todavía no hay ítems en el carrusel.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Orden</th>
            <th className="py-2 pr-3">Título</th>
            <th className="py-2 pr-3">Tipo</th>
            <th className="py-2 pr-3">Vigencia</th>
            <th className="py-2 pr-3">Estado</th>
            <th className="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => onMover(item, "arriba")}
                    className="disabled:opacity-30"
                    aria-label="Mover arriba"
                  >
                    <i className="fa-solid fa-caret-up"></i>
                  </button>
                  <button
                    type="button"
                    disabled={i === items.length - 1}
                    onClick={() => onMover(item, "abajo")}
                    className="disabled:opacity-30"
                    aria-label="Mover abajo"
                  >
                    <i className="fa-solid fa-caret-down"></i>
                  </button>
                </div>
              </td>
              <td className="py-2 pr-3 font-semibold">{item.titulo}</td>
              <td className="py-2 pr-3">{TIPO_LABEL[item.tipo]}</td>
              <td className="py-2 pr-3 text-text-body">
                {item.fechaInicio || item.fechaFin
                  ? `${item.fechaInicio ?? "…"} → ${item.fechaFin ?? "…"}`
                  : "Sin límite"}
              </td>
              <td className="py-2 pr-3">
                {item.activo ? (
                  <span className="text-teal font-semibold">Activo</span>
                ) : (
                  <span className="text-[#999]">Inactivo</span>
                )}
              </td>
              <td className="py-2 pr-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEditar(item)}
                    className="text-teal font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(item)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
