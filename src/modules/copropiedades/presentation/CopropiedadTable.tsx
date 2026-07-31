"use client";

import type { Copropiedad } from "../domain/types";

interface Props {
  items: Copropiedad[];
  onEditar: (item: Copropiedad) => void;
  onImportar: (item: Copropiedad) => void;
}

export function CopropiedadTable({ items, onEditar, onImportar }: Props) {
  if (items.length === 0) {
    return <p className="text-text-body">Todavía no hay copropiedades registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">NIT</th>
            <th className="py-2 pr-3">Ciudad</th>
            <th className="py-2 pr-3">Estado</th>
            <th className="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 font-semibold">{item.nombre}</td>
              <td className="py-2 pr-3 text-text-body">{item.nit ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">{item.ciudad ?? "—"}</td>
              <td className="py-2 pr-3">
                {item.estado === "activa" ? (
                  <span className="text-teal font-semibold">Activa</span>
                ) : (
                  <span className="text-[#999]">Inactiva</span>
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
                    onClick={() => onImportar(item)}
                    className="text-teal font-semibold hover:underline"
                  >
                    Importar unidades
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
