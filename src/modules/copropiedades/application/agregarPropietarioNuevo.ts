import type { PersonaInput } from "../domain/types";
import { validarPersona, validarPorcentajeParticipacion } from "../domain/validacion";
import { agregarPropietario, crearPersona } from "../infrastructure/copropiedadRepository";

export async function agregarPropietarioNuevo(
  unidadId: string,
  datosPersona: PersonaInput,
  porcentajeParticipacion: number
): Promise<void> {
  const errores = [...validarPersona(datosPersona), ...validarPorcentajeParticipacion(porcentajeParticipacion)];
  if (errores.length > 0) throw new Error(errores.join(" "));

  const persona = await crearPersona(datosPersona);
  await agregarPropietario(unidadId, persona.id, porcentajeParticipacion);
}
