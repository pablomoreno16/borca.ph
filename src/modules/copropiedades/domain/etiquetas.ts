import type { TipoCopropiedad, TipoUnidad } from "./types";

export const TIPO_UNIDAD_LABEL: Record<TipoUnidad, string> = {
  apartamento: "Apartamento",
  parqueadero: "Parqueadero",
  deposito: "Depósito",
  local: "Local",
  oficina: "Oficina",
};

export const TIPO_COPROPIEDAD_LABEL: Record<TipoCopropiedad, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  mixta: "Mixta",
};
