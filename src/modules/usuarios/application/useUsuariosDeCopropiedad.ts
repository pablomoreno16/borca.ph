"use client";

import { useCallback, useEffect, useState } from "react";
import type { UsuarioUnidad } from "../domain/types";
import { listarUsuariosDeCopropiedad } from "../infrastructure/usuarioRepository";

export function useUsuariosDeCopropiedad(copropiedadId: string) {
  const [usuarios, setUsuarios] = useState<UsuarioUnidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setUsuarios(await listarUsuariosDeCopropiedad(copropiedadId));
    } catch {
      setError("No se pudieron cargar los usuarios de esta copropiedad.");
    } finally {
      setCargando(false);
    }
  }, [copropiedadId]);

  useEffect(() => {
    let activo = true;
    listarUsuariosDeCopropiedad(copropiedadId)
      .then((datos) => {
        if (activo) setUsuarios(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los usuarios de esta copropiedad.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [copropiedadId]);

  return { usuarios, cargando, error, recargar };
}
