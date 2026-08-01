"use client";

import { useEffect, useState } from "react";
import { obtenerSumaParticipacionActiva } from "../infrastructure/copropiedadRepository";

export function useSumaParticipacion(unidadId: string, version = 0) {
  const [suma, setSuma] = useState<number | null>(null);

  useEffect(() => {
    if (!unidadId) return;
    let activo = true;
    obtenerSumaParticipacionActiva(unidadId).then((resultado) => {
      if (activo) setSuma(resultado);
    });
    return () => {
      activo = false;
    };
  }, [unidadId, version]);

  return suma;
}
