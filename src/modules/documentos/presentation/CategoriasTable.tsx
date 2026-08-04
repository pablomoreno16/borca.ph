"use client";

import type { CategoriaDocumento } from "../domain/types";
import { ROL_DOCUMENTO_LABEL } from "../domain/etiquetas";

interface Props {
  categorias: CategoriaDocumento[];
  onEditar: (categoria: CategoriaDocumento) => void;
  onEliminar: (categoria: CategoriaDocumento) => void;
}

export function CategoriasTable({ categorias, onEditar, onEliminar }: Props) {
  if (categorias.length === 0) {
    return <p className="text-text-body">Todavía no hay categorías de documento.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">Roles con acceso</th>
            <th className="py-2 pr-3">Estado</th>
            <th className="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 font-semibold">{categoria.nombre}</td>
              <td className="py-2 pr-3 text-text-body">
                {categoria.roles.length > 0
                  ? categoria.roles.map((rol) => ROL_DOCUMENTO_LABEL[rol]).join(", ")
                  : "—"}
              </td>
              <td className="py-2 pr-3">
                {categoria.activo ? (
                  <span className="text-teal font-semibold">Activo</span>
                ) : (
                  <span className="text-[#999]">Inactivo</span>
                )}
              </td>
              <td className="py-2 pr-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEditar(categoria)}
                    className="text-teal font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(categoria)}
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
