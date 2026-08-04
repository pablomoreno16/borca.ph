"use client";

import { useCallback, useEffect, useState } from "react";
import type { Documento } from "../domain/types";
import { listarDocumentosDeCopropiedad } from "../infrastructure/documentoRepository";

export function useDocumentosDeCopropiedad(copropiedadId: string) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setDocumentos(await listarDocumentosDeCopropiedad(copropiedadId));
    } catch {
      setError("No se pudieron cargar los documentos.");
    } finally {
      setCargando(false);
    }
  }, [copropiedadId]);

  useEffect(() => {
    let activo = true;
    listarDocumentosDeCopropiedad(copropiedadId)
      .then((datos) => {
        if (activo) setDocumentos(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los documentos.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [copropiedadId]);

  return { documentos, cargando, error, recargar };
}
