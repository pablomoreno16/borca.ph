import type { Persona } from "../domain/types";
import { buscarPersonaPorDocumento } from "../infrastructure/copropiedadRepository";

export async function buscarPersona(tipoDocumento: string, numeroDocumento: string): Promise<Persona | null> {
  return buscarPersonaPorDocumento(tipoDocumento, numeroDocumento);
}
