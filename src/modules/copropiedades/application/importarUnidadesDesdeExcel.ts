import type { FilaImportada, ResumenImportacion } from "../domain/types";
import { normalizarEscalaCoeficientes, validarFilasImportadas } from "../domain/validacion";
import { parsearExcelUnidades } from "../infrastructure/excelParser";
import { existenUnidadesEnCopropiedad, importarUnidades } from "../infrastructure/copropiedadRepository";

export async function analizarExcelUnidades(
  archivo: File
): Promise<{ filas: FilaImportada[]; resumen: ResumenImportacion }> {
  const { filas: filasCrudas, errores: erroresParseo } = await parsearExcelUnidades(archivo);
  const { filas, escalaConvertida } = normalizarEscalaCoeficientes(filasCrudas);
  const resumen = validarFilasImportadas(filas, erroresParseo, escalaConvertida);
  return { filas, resumen };
}

// El import reemplaza TODAS las unidades existentes de la copropiedad, así
// que la UI debe preguntar antes de llamar a esto si ya hay datos cargados.
export async function hayUnidadesQueSeReemplazaran(copropiedadId: string): Promise<boolean> {
  return existenUnidadesEnCopropiedad(copropiedadId);
}

export async function confirmarImportacion(copropiedadId: string, filas: FilaImportada[]): Promise<void> {
  const resumen = validarFilasImportadas(filas);
  if (!resumen.esValida) throw new Error(resumen.errores.join(" "));
  await importarUnidades(copropiedadId, filas);
}
