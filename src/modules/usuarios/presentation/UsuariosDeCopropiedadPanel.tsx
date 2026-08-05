"use client";

import { useUsuariosDeCopropiedad } from "../application/useUsuariosDeCopropiedad";
import { UsuariosUnidadTable } from "./UsuariosUnidadTable";

interface Props {
  copropiedadId: string;
}

export function UsuariosDeCopropiedadPanel({ copropiedadId }: Props) {
  const { usuarios, cargando, error } = useUsuariosDeCopropiedad(copropiedadId);

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-sm text-text-body">
        Para gestionar los roles de un usuario que ya tiene cuenta, hazlo desde{" "}
        <a href="/admin/usuarios" className="text-teal hover:underline">
          Usuarios
        </a>
        .
      </p>

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && <UsuariosUnidadTable usuarios={usuarios} />}
    </div>
  );
}
