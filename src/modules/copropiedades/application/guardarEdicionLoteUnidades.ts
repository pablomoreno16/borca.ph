import type { CambiosUnidadEnLote } from "../domain/types";
import { validarEdicionLote } from "../domain/validacion";
import { actualizarUnidadesEnLote } from "../infrastructure/copropiedadRepository";

export async function guardarEdicionLoteUnidades(ids: string[], cambios: CambiosUnidadEnLote): Promise<void> {
  const errores = validarEdicionLote(ids, cambios);
  if (errores.length > 0) throw new Error(errores.join(" "));
  await actualizarUnidadesEnLote(ids, cambios);
}
