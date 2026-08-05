"use client";

import type { UsuarioUnidad } from "../domain/types";
import { ROL_LABEL } from "../domain/etiquetas";

interface Props {
  usuarios: UsuarioUnidad[];
}

function textoPerfil(usuario: UsuarioUnidad): string {
  if (!usuario.tienePerfil) return "Sin cuenta";
  if (usuario.roles.length === 0) return "Con cuenta, sin rol asignado";
  return usuario.roles.map((r) => ROL_LABEL[r]).join(", ");
}

export function UsuariosUnidadTable({ usuarios }: Props) {
  if (usuarios.length === 0) {
    return <p className="text-text-body">Todavía no hay propietarios registrados en esta copropiedad.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Tipo de documento</th>
            <th className="py-2 pr-3">Número de documento</th>
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">Correo</th>
            <th className="py-2 pr-3">Teléfono</th>
            <th className="py-2 pr-3">Unidad privada</th>
            <th className="py-2 pr-3">% de participación</th>
            <th className="py-2 pr-3">Perfil</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, i) => (
            <tr key={`${usuario.personaId}-${usuario.unidadBloque}-${usuario.unidadIdentificador}-${i}`} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 text-text-body">{usuario.tipoDocumento ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">{usuario.numeroDocumento ?? "—"}</td>
              <td className="py-2 pr-3 font-semibold">{usuario.nombre}</td>
              <td className="py-2 pr-3 text-text-body">{usuario.correo ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">{usuario.telefono ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">
                {usuario.unidadBloque}-{usuario.unidadIdentificador}
              </td>
              <td className="py-2 pr-3 text-text-body">
                {usuario.porcentajeParticipacion !== null ? `${usuario.porcentajeParticipacion}%` : "—"}
              </td>
              <td className="py-2 pr-3 text-text-body">{textoPerfil(usuario)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
