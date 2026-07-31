import type { FilaImportada, ResumenImportacion } from "../domain/types";
import { normalizarEscalaCoeficientes, validarFilasImportadas } from "../domain/validacion";
import { parsearExcelUnidades } from "../infrastructure/excelParser";
import { importarUnidades } from "../infrastructure/copropiedadRepository";

export async function analizarExcelUnidades(
  archivo: File
): Promise<{ filas: FilaImportada[]; resumen: ResumenImportacion }> {
  const filasCrudas = await parsearExcelUnidades(archivo);
  const { filas, escalaConvertida } = normalizarEscalaCoeficientes(filasCrudas);
  const resumen = validarFilasImportadas(filas, escalaConvertida);
  return { filas, resumen };
}

export async function confirmarImportacion(copropiedadId: string, filas: FilaImportada[]): Promise<void> {
  const resumen = validarFilasImportadas(filas);
  if (!resumen.esValida) throw new Error(resumen.errores.join(" "));
  await importarUnidades(copropiedadId, filas);
}
