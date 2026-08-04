"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { useCategorias } from "@/modules/documentos/application/useCategorias";
import { guardarCategoria } from "@/modules/documentos/application/guardarCategoria";
import { eliminarCategoria } from "@/modules/documentos/infrastructure/documentoRepository";
import { CategoriasTable } from "@/modules/documentos/presentation/CategoriasTable";
import { CategoriaForm } from "@/modules/documentos/presentation/CategoriaForm";
import type { CategoriaDocumento, CategoriaDocumentoInput } from "@/modules/documentos/domain/types";

export default function AdminDocumentosPage() {
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin/carrusel");
  }, [cargandoSesion, autorizado, router]);

  const { categorias, cargando, error, recargar } = useCategorias();
  const [editando, setEditando] = useState<CategoriaDocumento | null>(null);
  const [creando, setCreando] = useState(false);

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  async function onGuardar(input: CategoriaDocumentoInput, id?: string) {
    await guardarCategoria(input, id);
    setEditando(null);
    setCreando(false);
    await recargar();
  }

  async function onEliminar(categoria: CategoriaDocumento) {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    await eliminarCategoria(categoria.id);
    await recargar();
  }

  const mostrandoForm = creando || editando !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-teal">Documentos</h1>
        {!mostrandoForm && (
          <button type="button" onClick={() => setCreando(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-plus"></i> Nueva categoría
          </button>
        )}
      </div>

      {mostrandoForm && (
        <CategoriaForm
          itemInicial={editando ?? undefined}
          onGuardar={onGuardar}
          onCancelar={() => {
            setEditando(null);
            setCreando(false);
          }}
        />
      )}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && !mostrandoForm && (
        <CategoriasTable
          categorias={categorias}
          onEditar={(categoria) => {
            setEditando(categoria);
            setCreando(false);
          }}
          onEliminar={onEliminar}
        />
      )}
    </div>
  );
}
