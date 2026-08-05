"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { useUsuarios } from "@/modules/usuarios/application/useUsuarios";
import { UsuariosTable } from "@/modules/usuarios/presentation/UsuariosTable";
import { EditarUsuarioModal } from "@/modules/usuarios/presentation/EditarUsuarioModal";
import { Modal } from "@/shared/ui/Modal";
import type { PerfilConRoles } from "@/modules/usuarios/domain/types";

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin/carrusel");
  }, [cargandoSesion, autorizado, router]);

  const { perfiles, cargando, error, recargar } = useUsuarios();
  const [editando, setEditando] = useState<PerfilConRoles | null>(null);

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-teal">Usuarios</h1>

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && <UsuariosTable perfiles={perfiles} onEditar={setEditando} />}

      {editando && (
        <Modal onClose={() => setEditando(null)}>
          <EditarUsuarioModal perfil={editando} onGuardado={recargar} onCancelar={() => setEditando(null)} />
        </Modal>
      )}
    </div>
  );
}
