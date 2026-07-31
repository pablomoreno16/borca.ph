import { validarCopropiedad } from "../domain/validacion";
import type { Copropiedad, CopropiedadInput } from "../domain/types";
import { actualizarCopropiedad, crearCopropiedad } from "../infrastructure/copropiedadRepository";

export async function guardarCopropiedad(input: CopropiedadInput, id?: string): Promise<Copropiedad> {
  const errores = validarCopropiedad(input);
  if (errores.length > 0) throw new Error(errores.join(" "));
  return id ? actualizarCopropiedad(id, input) : crearCopropiedad(input);
}
