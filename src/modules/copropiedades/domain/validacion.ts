import type {
  CambiosUnidadEnLote,
  CopropiedadInput,
  FilaImportada,
  PersonaInput,
  ResumenImportacion,
  UnidadPrivadaInput,
} from "./types";

export function validarCopropiedad(input: CopropiedadInput): string[] {
  const errores: string[] = [];
  if (!input.nombre.trim()) errores.push("El nombre es obligatorio.");
  return errores;
}

export function validarUnidad(input: UnidadPrivadaInput): string[] {
  const errores: string[] = [];
  if (!input.identificador.trim()) errores.push("El número de la unidad es obligatorio.");
  if (!(input.coeficiente > 0)) errores.push("El coeficiente debe ser mayor a 0.");
  return errores;
}

export function validarEdicionLote(ids: string[], cambios: CambiosUnidadEnLote): string[] {
  const errores: string[] = [];
  if (ids.length === 0) errores.push("No hay unidades seleccionadas.");
  if (cambios.tipo === undefined && cambios.coeficiente === undefined) {
    errores.push("Selecciona al menos un campo para actualizar.");
  }
  if (cambios.coeficiente !== undefined && !(cambios.coeficiente > 0)) {
    errores.push("El coeficiente debe ser mayor a 0.");
  }
  return errores;
}

export function validarPersona(input: PersonaInput): string[] {
  const errores: string[] = [];
  if (!input.nombre.trim()) errores.push("El nombre es obligatorio.");
  return errores;
}

export function validarPorcentajeParticipacion(valor: number): string[] {
  const errores: string[] = [];
  if (!(valor > 0)) errores.push("El % de participación debe ser mayor a 0.");
  if (valor > 100) errores.push("El % de participación no puede ser mayor a 100.");
  return errores;
}

// Muchos reglamentos de propiedad horizontal en Colombia expresan el
// coeficiente como porcentaje (1 a 100, ej. "2.35678") en vez de fracción
// (0 a 1, ej. "0.0235678"). El sistema siempre guarda la fracción (0-1) —
// es la convención que necesitan los cálculos de quórum/voto más adelante
// — así que si la suma cruda da mucho más que 1, se asume escala 1-100 y
// se normaliza dividiendo entre 100.
const UMBRAL_ESCALA_PORCENTAJE = 10;

export function normalizarEscalaCoeficientes(filas: FilaImportada[]): {
  filas: FilaImportada[];
  escalaConvertida: boolean;
} {
  const sumaCruda = filas.reduce((acc, fila) => acc + fila.coeficiente, 0);
  if (sumaCruda <= UMBRAL_ESCALA_PORCENTAJE) return { filas, escalaConvertida: false };
  return {
    filas: filas.map((fila) => ({ ...fila, coeficiente: fila.coeficiente / 100 })),
    escalaConvertida: true,
  };
}

// La suma de coeficientes de las unidades de una copropiedad debe dar 1.0
// (Ley 675 art. 3). Se acepta un margen pequeño por redondeo del Excel.
const TOLERANCIA_COEFICIENTES = 0.01;

// erroresPrevios: errores por celda ya detectados al parsear el Excel
// (infrastructure/excelParser.ts), que tiene el texto crudo de cada celda
// para dar mensajes concretos ("Fila 5, columna Tipo: ..."). Esta función
// solo agrega las reglas que dependen del archivo completo.
export function validarFilasImportadas(
  filas: FilaImportada[],
  erroresPrevios: string[] = [],
  escalaConvertida = false
): ResumenImportacion {
  const errores = [...erroresPrevios];

  if (filas.length === 0) {
    errores.push("El archivo no tiene filas de unidades.");
  }

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
    escalaConvertida,
  };
}
