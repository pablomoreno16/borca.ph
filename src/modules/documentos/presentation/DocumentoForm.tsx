"use client";

import { useState, type FormEvent } from "react";
import type { CategoriaDocumento, Documento, DocumentoInput } from "../domain/types";

interface Props {
  copropiedadId: string;
  categorias: CategoriaDocumento[];
  itemInicial?: Documento;
  onGuardar: (input: DocumentoInput, archivo: File | null, id?: string) => Promise<void>;
  onCancelar: () => void;
}

export function DocumentoForm({ copropiedadId, categorias, itemInicial, onGuardar, onCancelar }: Props) {
  const [categoriaDocumentoId, setCategoriaDocumentoId] = useState(
    itemInicial?.categoriaDocumentoId ?? categorias[0]?.id ?? ""
  );
  const [titulo, setTitulo] = useState(itemInicial?.titulo ?? "");
  const [fechaElaboracion, setFechaElaboracion] = useState(itemInicial?.fechaElaboracion ?? "");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivoActual] = useState(itemInicial ? archivoNombreDesdePath(itemInicial.archivoPath) : null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function archivoNombreDesdePath(path: string): string {
    return path.split("/").pop() ?? path;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar(
        { copropiedadId, categoriaDocumentoId, titulo, fechaElaboracion },
        archivo,
        itemInicial?.id
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el documento.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      <div>
        <label className="block text-sm font-bold mb-1">Categoría</label>
        <select
          required
          value={categoriaDocumentoId}
          onChange={(e) => setCategoriaDocumentoId(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categorias
            .filter((c) => c.activo || c.id === categoriaDocumentoId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
        </select>
      </div>
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
        <label className="block text-sm font-bold mb-1">Fecha de elaboración</label>
        <input
          required
          type="date"
          value={fechaElaboracion}
          onChange={(e) => setFechaElaboracion(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">
          {itemInicial ? "Reemplazar archivo (opcional)" : "Archivo"}
        </label>
        {itemInicial && nombreArchivoActual && !archivo && (
          <p className="text-xs text-text-body mb-1.5">Archivo actual: {nombreArchivoActual}</p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <label
            htmlFor="archivo-documento"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#d8dedd] px-3 py-2 text-sm font-semibold text-teal cursor-pointer hover:bg-[#f4f7f6]"
          >
            <i className="fa-solid fa-upload"></i> Selecciona archivo
          </label>
          <input
            id="archivo-documento"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          {archivo && <span className="text-sm text-text-body">{archivo.name}</span>}
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
