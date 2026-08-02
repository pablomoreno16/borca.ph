"use client";

import { useEffect, useState } from "react";
import type { PaginaUnidades } from "../domain/types";
import { listarUnidadesPaginadas } from "../infrastructure/copropiedadRepository";

export function useUnidadesPaginadas(copropiedadId: string) {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [version, setVersion] = useState(0);
  const [datos, setDatos] = useState<PaginaUnidades>({ items: [], total: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // setState solo dentro de callbacks de la promesa (no de forma síncrona
  // en el cuerpo del efecto), como pide react-hooks/set-state-in-effect.
  useEffect(() => {
    let activo = true;
    listarUnidadesPaginadas(copropiedadId, { pagina, porPagina, filtro })
      .then((resultado) => {
        if (activo) setDatos(resultado);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar las unidades.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [copropiedadId, pagina, porPagina, filtro, version]);

  // No cambia pagina/porPagina/filtro, así que no dispara el efecto por sí
  // solo: se usa tras una edición masiva para releer la página actual.
  function refrescar() {
    setVersion((v) => v + 1);
  }

  function cambiarFiltro(valor: string) {
    setFiltro(valor);
    setPagina(1);
  }

  function cambiarPorPagina(valor: number) {
    setPorPagina(valor);
    setPagina(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(datos.total / porPagina));

  return {
    items: datos.items,
    total: datos.total,
    pagina,
    totalPaginas,
    porPagina,
    filtro,
    cargando,
    error,
    setPagina,
    cambiarPorPagina,
    cambiarFiltro,
    refrescar,
  };
}
