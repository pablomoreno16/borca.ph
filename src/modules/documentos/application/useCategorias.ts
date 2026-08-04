"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategoriaDocumento } from "../domain/types";
import { listarCategorias } from "../infrastructure/documentoRepository";

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaDocumento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setCategorias(await listarCategorias());
    } catch {
      setError("No se pudieron cargar las categorías de documento.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    listarCategorias()
      .then((datos) => {
        if (activo) setCategorias(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar las categorías de documento.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { categorias, cargando, error, recargar };
}
