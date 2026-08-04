import { validarCategoria } from "../domain/validacion";
import type { CategoriaDocumento, CategoriaDocumentoInput } from "../domain/types";
import { actualizarCategoria, crearCategoria } from "../infrastructure/documentoRepository";

export async function guardarCategoria(
  input: CategoriaDocumentoInput,
  id?: string
): Promise<CategoriaDocumento> {
  const errores = validarCategoria(input);
  if (errores.length > 0) throw new Error(errores.join(" "));
  return id ? actualizarCategoria(id, input) : crearCategoria(input);
}
