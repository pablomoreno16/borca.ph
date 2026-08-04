"use client";

import { useState } from "react";
import type { CategoriaDocumento, Documento } from "../domain/types";
import { crearUrlFirmada } from "../infrastructure/documentoRepository";

interface Props {
  documentos: Documento[];
  categorias: CategoriaDocumento[];
  onEditar: (documento: Documento) => void;
  onEliminar: (documento: Documento) => void;
}

export function DocumentosTable({ documentos, categorias, onEditar, onEliminar }: Props) {
  const [abriendoId, setAbriendoId] = useState<string | null>(null);
  const nombreCategoria = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? "—";

  async function onVer(documento: Documento) {
    // window.open() debe llamarse de forma síncrona dentro del click —
    // si se llama después de un await, el navegador pierde el contexto
    // de gesto del usuario y puede bloquear la pestaña como popup.
    const nuevaVentana = window.open("", "_blank");
    if (nuevaVentana) nuevaVentana.opener = null;
    setAbriendoId(documento.id);
    try {
      const url = await crearUrlFirmada(documento.archivoPath);
      if (nuevaVentana) nuevaVentana.location.href = url;
    } finally {
      setAbriendoId(null);
    }
  }

  if (documentos.length === 0) {
    return <p className="text-text-body">Todavía no hay documentos para esta copropiedad.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Categoría</th>
            <th className="py-2 pr-3">Título</th>
            <th className="py-2 pr-3">Fecha de elaboración</th>
            <th className="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 text-text-body">{nombreCategoria(documento.categoriaDocumentoId)}</td>
              <td className="py-2 pr-3 font-semibold">{documento.titulo}</td>
              <td className="py-2 pr-3 text-text-body">{documento.fechaElaboracion}</td>
              <td className="py-2 pr-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={abriendoId === documento.id}
                    onClick={() => onVer(documento)}
                    className="text-teal font-semibold hover:underline disabled:opacity-60"
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditar(documento)}
                    className="text-teal font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(documento)}
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
