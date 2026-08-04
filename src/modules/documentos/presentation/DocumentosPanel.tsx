"use client";

import { useState } from "react";
import { useCategorias } from "../application/useCategorias";
import { useDocumentosDeCopropiedad } from "../application/useDocumentosDeCopropiedad";
import { guardarDocumento } from "../application/guardarDocumento";
import { eliminarDocumento } from "../infrastructure/documentoRepository";
import { DocumentosTable } from "./DocumentosTable";
import { DocumentoForm } from "./DocumentoForm";
import { Modal } from "@/shared/ui/Modal";
import type { Documento, DocumentoInput } from "../domain/types";

interface Props {
  copropiedadId: string;
}

export function DocumentosPanel({ copropiedadId }: Props) {
  const { categorias, cargando: cargandoCategorias } = useCategorias();
  const { documentos, cargando, error, recargar } = useDocumentosDeCopropiedad(copropiedadId);
  const [editando, setEditando] = useState<Documento | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function onGuardar(input: DocumentoInput, archivo: File | null, id?: string) {
    await guardarDocumento(input, archivo, id);
    setEditando(null);
    setSubiendo(false);
    await recargar();
  }

  async function onEliminar(documento: Documento) {
    if (!confirm(`¿Eliminar el documento "${documento.titulo}"?`)) return;
    await eliminarDocumento(documento.id);
    await recargar();
  }

  const mostrandoForm = subiendo || editando !== null;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-3">
        <button
          type="button"
          disabled={cargandoCategorias || categorias.length === 0}
          onClick={() => setSubiendo(true)}
          className="btn-cta bg-gold disabled:opacity-60"
        >
          <i className="fa-solid fa-upload"></i> Subir documento
        </button>
      </div>
      {!cargandoCategorias && categorias.length === 0 && (
        <p className="text-sm text-text-body">
          Todavía no hay categorías de documento — créalas primero en{" "}
          <a href="/admin/documentos" className="text-teal hover:underline">
            Documentos
          </a>
          .
        </p>
      )}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && (
        <DocumentosTable
          documentos={documentos}
          categorias={categorias}
          onEditar={setEditando}
          onEliminar={onEliminar}
        />
      )}

      {mostrandoForm && (
        <Modal
          onClose={() => {
            setEditando(null);
            setSubiendo(false);
          }}
        >
          <DocumentoForm
            copropiedadId={copropiedadId}
            categorias={categorias}
            itemInicial={editando ?? undefined}
            onGuardar={onGuardar}
            onCancelar={() => {
              setEditando(null);
              setSubiendo(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
