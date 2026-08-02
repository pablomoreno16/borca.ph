import type { PersonaInput } from "../domain/types";
import { validarPersona, validarPorcentajeParticipacion } from "../domain/validacion";
import { actualizarParticipacionPropietario, actualizarPersona } from "../infrastructure/copropiedadRepository";

export async function editarPropietario(
  propietarioId: string,
  personaId: string,
  datosPersona: PersonaInput,
  porcentajeParticipacion: number
): Promise<void> {
  const errores = [...validarPersona(datosPersona), ...validarPorcentajeParticipacion(porcentajeParticipacion)];
  if (errores.length > 0) throw new Error(errores.join(" "));

  await actualizarPersona(personaId, datosPersona);
  await actualizarParticipacionPropietario(propietarioId, porcentajeParticipacion);
}
