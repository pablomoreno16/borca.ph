"use client";

import { useEffect, useState } from "react";
import { existenUnidadesEnCopropiedad } from "../infrastructure/copropiedadRepository";

export function useExistenUnidades(copropiedadId: string, version = 0) {
  const [existen, setExisten] = useState<boolean | null>(null);

  useEffect(() => {
    if (!copropiedadId) return;
    let activo = true;
    existenUnidadesEnCopropiedad(copropiedadId).then((resultado) => {
      if (activo) setExisten(resultado);
    });
    return () => {
      activo = false;
    };
  }, [copropiedadId, version]);

  return existen;
}
