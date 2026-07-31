import type { FilaImportada, ResumenImportacion } from "../domain/types";
import { validarFilasImportadas } from "../domain/validacion";
import { parsearExcelUnidades } from "../infrastructure/excelParser";
import { importarUnidades } from "../infrastructure/copropiedadRepository";

export async function analizarExcelUnidades(
  archivo: File
): Promise<{ filas: FilaImportada[]; resumen: ResumenImportacion }> {
  const filas = await parsearExcelUnidades(archivo);
  const resumen = validarFilasImportadas(filas);
  return { filas, resumen };
}

export async function confirmarImportacion(copropiedadId: string, filas: FilaImportada[]): Promise<void> {
  const resumen = validarFilasImportadas(filas);
  if (!resumen.esValida) throw new Error(resumen.errores.join(" "));
  await importarUnidades(copropiedadId, filas);
}
