import ExcelJS from "exceljs";
import type { FilaImportada, TipoUnidad } from "../domain/types";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";

const ALIAS_ENCABEZADOS = {
  bloque: ["bloque", "torre"],
  apartamento: ["apartamento", "# apartamento", "apto", "# apto", "unidad"],
  tipo: ["tipo"],
  coeficiente: ["coeficiente", "coeficiente de copropiedad", "coef"],
  propietario1: ["propietario 1", "propietario1", "propietario"],
  propietario2: ["propietario 2", "propietario2"],
  propietario3: ["propietario 3", "propietario3"],
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function encontrarColumna(encabezados: string[], alias: string[]): number {
  const normalizados = encabezados.map(normalizar);
  for (const a of alias) {
    const i = normalizados.indexOf(normalizar(a));
    if (i !== -1) return i;
  }
  return -1;
}

// Compara el texto de la celda "Tipo" contra las etiquetas ya usadas en el
// resto de la app (domain/etiquetas.ts), sin distinguir mayúsculas/acentos,
// para que sea la única fuente de verdad de qué tipos son válidos.
const TIPO_POR_TEXTO_NORMALIZADO = new Map<string, TipoUnidad>(
  (Object.entries(TIPO_UNIDAD_LABEL) as [TipoUnidad, string][]).map(([clave, etiqueta]) => [
    normalizar(etiqueta),
    clave,
  ])
);
const TIPOS_VALIDOS_TEXTO = Object.values(TIPO_UNIDAD_LABEL).join(", ");

export async function parsearExcelUnidades(archivo: File): Promise<{ filas: FilaImportada[]; errores: string[] }> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await archivo.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const hoja = workbook.worksheets[0];
  if (!hoja) throw new Error("El archivo no tiene ninguna hoja de cálculo.");

  const valoresEncabezado = hoja.getRow(1).values as unknown[];
  const encabezados = valoresEncabezado.slice(1).map((h) => (h ?? "").toString());

  const idxBloque = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.bloque);
  const idxApartamento = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.apartamento);
  const idxTipo = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.tipo);
  const idxCoeficiente = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.coeficiente);
  const idxPropietario1 = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.propietario1);
  const idxPropietario2 = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.propietario2);
  const idxPropietario3 = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.propietario3);

  if (idxApartamento === -1 || idxTipo === -1 || idxCoeficiente === -1 || idxPropietario1 === -1) {
    throw new Error(
      "No se encontraron las columnas esperadas. El archivo debe tener: Apartamento, Tipo, Coeficiente y " +
        "Propietario 1 (Torre, Propietario 2 y Propietario 3 son opcionales)."
    );
  }

  const filas: FilaImportada[] = [];
  const errores: string[] = [];

  hoja.eachRow((row, numeroFila) => {
    if (numeroFila === 1) return;
    const valores = row.values as unknown[];
    const obtener = (idx: number) => (idx === -1 ? undefined : valores[idx + 1]);

    const apartamentoCrudo = obtener(idxApartamento);
    const tipoCrudo = obtener(idxTipo);
    const coefCrudo = obtener(idxCoeficiente);
    const propietario1Crudo = obtener(idxPropietario1);
    const propietario2Crudo = obtener(idxPropietario2);
    const propietario3Crudo = obtener(idxPropietario3);

    // Fila totalmente vacía: se ignora en vez de reportar errores.
    if (
      apartamentoCrudo == null &&
      tipoCrudo == null &&
      coefCrudo == null &&
      propietario1Crudo == null &&
      propietario2Crudo == null &&
      propietario3Crudo == null
    ) {
      return;
    }

    const bloqueCrudo = obtener(idxBloque);
    const bloque = bloqueCrudo ? String(bloqueCrudo).trim() || "1" : "1";

    const apartamento = String(apartamentoCrudo ?? "").trim();
    if (!apartamento) {
      errores.push(`Fila ${numeroFila}, columna "Apartamento": falta el número de apartamento.`);
    }

    const tipoTexto = String(tipoCrudo ?? "").trim();
    let tipo: TipoUnidad | null = null;
    if (!tipoTexto) {
      errores.push(`Fila ${numeroFila}, columna "Tipo": falta el tipo de unidad.`);
    } else {
      tipo = TIPO_POR_TEXTO_NORMALIZADO.get(normalizar(tipoTexto)) ?? null;
      if (!tipo) {
        errores.push(
          `Fila ${numeroFila}, columna "Tipo": el valor "${tipoTexto}" no es válido (debe ser ${TIPOS_VALIDOS_TEXTO}).`
        );
      }
    }

    let coeficiente = 0;
    const coefTexto = String(coefCrudo ?? "").trim();
    if (!coefTexto) {
      errores.push(`Fila ${numeroFila}, columna "Coeficiente": falta el coeficiente.`);
    } else {
      const coefParseado = typeof coefCrudo === "number" ? coefCrudo : parseFloat(coefTexto.replace(",", "."));
      if (!Number.isFinite(coefParseado)) {
        errores.push(`Fila ${numeroFila}, columna "Coeficiente": el valor "${coefTexto}" no es un número válido.`);
      } else {
        coeficiente = coefParseado;
      }
    }

    const propietarios = [propietario1Crudo, propietario2Crudo, propietario3Crudo]
      .map((v) => String(v ?? "").trim())
      .filter((v) => v.length > 0);
    if (propietarios.length === 0) {
      errores.push(`Fila ${numeroFila}, columna "Propietario 1": falta el propietario.`);
    }

    filas.push({ bloque, apartamento, tipo, coeficiente, propietarios });
  });

  return { filas, errores };
}
