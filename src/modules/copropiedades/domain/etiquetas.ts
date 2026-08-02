import type { TipoCopropiedad, TipoUnidad } from "./types";

// Orden alfabético ascendente por etiqueta (no por clave).
export const TIPO_UNIDAD_LABEL: Record<TipoUnidad, string> = {
  apartamento: "Apartamento",
  cuarto_util: "Cuarto útil",
  deposito: "Depósito",
  local: "Local",
  oficina: "Oficina",
  parqueadero: "Parqueadero",
};

export const TIPO_COPROPIEDAD_LABEL: Record<TipoCopropiedad, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  mixta: "Mixta",
};
