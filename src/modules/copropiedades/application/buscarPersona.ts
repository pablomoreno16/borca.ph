import type { Persona } from "../domain/types";
import { buscarPersonaPorDocumento, buscarPersonasPorNombre as buscarPersonasPorNombreRepo } from "../infrastructure/copropiedadRepository";

export async function buscarPersona(tipoDocumento: string, numeroDocumento: string): Promise<Persona | null> {
  return buscarPersonaPorDocumento(tipoDocumento, numeroDocumento);
}

export async function buscarPersonasPorNombre(texto: string): Promise<Persona[]> {
  return buscarPersonasPorNombreRepo(texto);
}
