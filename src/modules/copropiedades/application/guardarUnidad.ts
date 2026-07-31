import type { UnidadPrivada, UnidadPrivadaInput } from "../domain/types";
import { validarUnidad } from "../domain/validacion";
import { actualizarUnidad } from "../infrastructure/copropiedadRepository";

export async function guardarUnidad(id: string, input: UnidadPrivadaInput): Promise<UnidadPrivada> {
  const errores = validarUnidad(input);
  if (errores.length > 0) throw new Error(errores.join(" "));
  return actualizarUnidad(id, input);
}
