import type { CopropiedadInput, FilaImportada, ResumenImportacion } from "./types";

export function validarCopropiedad(input: CopropiedadInput): string[] {
  const errores: string[] = [];
  if (!input.nombre.trim()) errores.push("El nombre es obligatorio.");
  return errores;
}

// La suma de coeficientes de las unidades de una copropiedad debe dar 1.0
// (Ley 675 art. 3). Se acepta un margen pequeño por redondeo del Excel.
const TOLERANCIA_COEFICIENTES = 0.01;

export function validarFilasImportadas(filas: FilaImportada[]): ResumenImportacion {
  const errores: string[] = [];

  if (filas.length === 0) {
    errores.push("El archivo no tiene filas de unidades.");
  }

  filas.forEach((fila, i) => {
    const numeroFila = i + 2; // +1 por encabezado, +1 por índice base 1
    if (!fila.apartamento) errores.push(`Fila ${numeroFila}: falta el número de apartamento.`);
    if (!fila.nombrePropietario) errores.push(`Fila ${numeroFila}: falta el nombre del propietario.`);
    if (!(fila.coeficiente > 0)) errores.push(`Fila ${numeroFila}: el coeficiente debe ser mayor a 0.`);
  });

  const sumaCoeficientes = filas.reduce((acc, fila) => acc + fila.coeficiente, 0);
  const diferencia = Math.abs(sumaCoeficientes - 1);
  if (filas.length > 0 && diferencia > TOLERANCIA_COEFICIENTES) {
    errores.push(
      `La suma de coeficientes es ${sumaCoeficientes.toFixed(4)}, debería ser 1.0000 (diferencia: ${diferencia.toFixed(4)}).`
    );
  }

  return {
    totalFilas: filas.length,
    sumaCoeficientes,
    diferencia,
    esValida: errores.length === 0,
    errores,
  };
}
