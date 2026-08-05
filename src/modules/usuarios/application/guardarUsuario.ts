import { validarPersona } from "@/modules/copropiedades/domain/validacion";
import { actualizarPersona } from "@/modules/copropiedades/infrastructure/copropiedadRepository";
import type { Persona, PersonaInput } from "@/modules/copropiedades/domain/types";

export async function guardarUsuario(personaId: string, input: PersonaInput): Promise<Persona> {
  const errores = validarPersona(input);
  if (errores.length > 0) throw new Error(errores.join(" "));
  return actualizarPersona(personaId, input);
}
