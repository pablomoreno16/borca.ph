"use client";

import { useCallback, useEffect, useState } from "react";
import type { CarruselItem } from "../domain/types";
import { listarItems } from "../infrastructure/carruselRepository";

export function useCarruselItems() {
  const [items, setItems] = useState<CarruselItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(await listarItems());
    } catch {
      setError("No se pudieron cargar los ítems del carrusel.");
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial: los setState corren dentro de callbacks de la promesa
  // (no de forma síncrona en el cuerpo del efecto), como pide la regla
  // react-hooks/set-state-in-effect. cargando/error ya arrancan en su
  // valor correcto (true/null), así que no hace falta resetearlos aquí.
  useEffect(() => {
    let activo = true;
    listarItems()
      .then((datos) => {
        if (activo) setItems(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los ítems del carrusel.");
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
