import type { Persona } from "../domain/types";
import { obtenerPersona as obtenerPersonaRepo } from "../infrastructure/copropiedadRepository";

export async function obtenerPersona(id: string): Promise<Persona> {
  return obtenerPersonaRepo(id);
}
