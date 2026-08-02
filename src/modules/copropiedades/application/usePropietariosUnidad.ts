"use client";

import { useEffect, useState } from "react";
import type { PropietarioUnidad } from "../domain/types";
import { listarPropietariosDeUnidad } from "../infrastructure/copropiedadRepository";

export function usePropietariosUnidad(unidadId: string) {
  const [propietarios, setPropietarios] = useState<PropietarioUnidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    listarPropietariosDeUnidad(unidadId)
      .then((resultado) => {
        if (activo) setPropietarios(resultado);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [unidadId, version]);

  function refrescar() {
    setVersion((v) => v + 1);
  }

  return { propietarios, cargando, refrescar };
}
