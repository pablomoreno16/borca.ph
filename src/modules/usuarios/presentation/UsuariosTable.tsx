"use client";

import type { PerfilConRoles } from "../domain/types";
import { ROL_LABEL } from "../domain/etiquetas";

interface Props {
  perfiles: PerfilConRoles[];
  onEditar: (perfil: PerfilConRoles) => void;
}

export function UsuariosTable({ perfiles, onEditar }: Props) {
  if (perfiles.length === 0) {
    return <p className="text-text-body">No hay usuarios para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">Correo</th>
            <th className="py-2 pr-3">Roles</th>
            <th className="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {perfiles.map((perfil) => (
            <tr key={perfil.perfilId} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 font-semibold">{perfil.nombre}</td>
              <td className="py-2 pr-3 text-text-body">{perfil.correo ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">
                {perfil.roles.length > 0
                  ? perfil.roles
                      .map((r) => `${ROL_LABEL[r.rol]}${r.copropiedadNombre ? ` (${r.copropiedadNombre})` : ""}`)
                      .join(", ")
                  : "Sin roles"}
              </td>
              <td className="py-2 pr-3">
                <button
                  type="button"
                  onClick={() => onEditar(perfil)}
                  className="text-teal font-semibold hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
