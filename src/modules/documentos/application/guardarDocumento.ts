import { validarArchivoDocumento, validarDocumento } from "../domain/validacion";
import type { Documento, DocumentoInput } from "../domain/types";
import { actualizarDocumento, subirDocumento } from "../infrastructure/documentoRepository";

// archivo es obligatorio al crear (no hay archivo previo que conservar) y
// opcional al editar (null = conservar el archivo actual).
export async function guardarDocumento(
  input: DocumentoInput,
  archivo: File | null,
  id?: string
): Promise<Documento> {
  const errores = validarDocumento(input);
  if (!id && !archivo) errores.push("El archivo es obligatorio.");
  if (archivo) errores.push(...validarArchivoDocumento(archivo));
  if (errores.length > 0) throw new Error(errores.join(" "));

  if (id) return actualizarDocumento(id, input, archivo);
  return subirDocumento(input, archivo as File);
}
