"use client";

import { useEffect, useState } from "react";
import { obtenerSumaCoeficientes } from "../infrastructure/copropiedadRepository";

export function useSumaCoeficientes(copropiedadId: string) {
  const [suma, setSuma] = useState<number | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerSumaCoeficientes(copropiedadId).then((resultado) => {
      if (activo) setSuma(resultado);
    });
    return () => {
      activo = false;
    };
  }, [copropiedadId]);

  return suma;
}
