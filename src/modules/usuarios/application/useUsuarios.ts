"use client";

import { useCallback, useEffect, useState } from "react";
import type { PerfilConRoles } from "../domain/types";
import { listarPerfiles } from "../infrastructure/usuarioRepository";

export function useUsuarios() {
  const [perfiles, setPerfiles] = useState<PerfilConRoles[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setPerfiles(await listarPerfiles());
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    listarPerfiles()
      .then((datos) => {
        if (activo) setPerfiles(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { perfiles, cargando, error, recargar };
}
