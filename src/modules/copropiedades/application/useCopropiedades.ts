"use client";

import { useCallback, useEffect, useState } from "react";
import type { Copropiedad } from "../domain/types";
import { listarCopropiedades } from "../infrastructure/copropiedadRepository";

export function useCopropiedades() {
  const [items, setItems] = useState<Copropiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(await listarCopropiedades());
    } catch {
      setError("No se pudieron cargar las copropiedades.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    listarCopropiedades()
      .then((datos) => {
        if (activo) setItems(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar las copropiedades.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { items, cargando, error, recargar };
}
