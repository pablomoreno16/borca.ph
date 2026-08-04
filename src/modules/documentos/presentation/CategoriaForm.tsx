"use client";

import { useState, type FormEvent } from "react";
import type { CategoriaDocumento, CategoriaDocumentoInput, RolDocumento } from "../domain/types";
import { ROLES_DOCUMENTO, ROL_DOCUMENTO_LABEL } from "../domain/etiquetas";

interface Props {
  itemInicial?: CategoriaDocumento;
  onGuardar: (input: CategoriaDocumentoInput, id?: string) => Promise<void>;
  onCancelar: () => void;
}

export function CategoriaForm({ itemInicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(itemInicial?.nombre ?? "");
  const [activo, setActivo] = useState(itemInicial?.activo ?? true);
  const [roles, setRoles] = useState<RolDocumento[]>(itemInicial?.roles ?? []);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function alternarRol(rol: RolDocumento) {
    setRoles((prev) => (prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar({ nombre, activo, roles }, itemInicial?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      <div>
        <label className="block text-sm font-bold mb-1">Nombre</label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          Activo
        </label>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1.5">
          Roles que pueden ver esta categoría
        </label>
        <p className="text-xs text-text-body mb-2">
          Sin efecto todavía en el acceso real (se activa cuando existan estos roles) — queda
          guardado para no configurarlo dos veces.
        </p>
        <div className="flex flex-col gap-1.5">
          {ROLES_DOCUMENTO.map((rol) => (
            <label key={rol} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={roles.includes(rol)} onChange={() => alternarRol(rol)} />
              {ROL_DOCUMENTO_LABEL[rol]}
            </label>
          ))}
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
