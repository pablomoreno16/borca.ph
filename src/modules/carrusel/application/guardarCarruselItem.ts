import { validarCarruselItem } from "../domain/validacion";
import type { CarruselItem, CarruselItemInput } from "../domain/types";
import { actualizarItem, crearItem } from "../infrastructure/carruselRepository";

export async function guardarCarruselItem(
  input: CarruselItemInput,
  id?: string
): Promise<CarruselItem> {
  const errores = validarCarruselItem(input);
  if (errores.length > 0) throw new Error(errores.join(" "));
  return id ? actualizarItem(id, input) : crearItem(input);
}
