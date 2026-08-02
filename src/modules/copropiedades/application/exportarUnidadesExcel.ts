import { listarUnidadesParaExportar } from "../infrastructure/copropiedadRepository";
import { generarExcelUnidades } from "../infrastructure/excelExporter";

export async function exportarUnidadesExcel(copropiedadId: string): Promise<Blob> {
  const filas = await listarUnidadesParaExportar(copropiedadId);
  return generarExcelUnidades(filas);
}
