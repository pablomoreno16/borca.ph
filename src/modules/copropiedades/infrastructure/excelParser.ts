import ExcelJS from "exceljs";
import type { FilaImportada } from "../domain/types";

const ALIAS_ENCABEZADOS = {
  bloque: ["bloque", "torre"],
  apartamento: ["apartamento", "# apartamento", "apto", "# apto", "unidad"],
  nombrePropietario: ["nombre del propietario", "propietario", "nombre"],
  coeficiente: ["coeficiente", "coeficiente de copropiedad", "coef"],
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

export async function parsearExcelUnidades(archivo: File): Promise<FilaImportada[]> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await archivo.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const hoja = workbook.worksheets[0];
  if (!hoja) throw new Error("El archivo no tiene ninguna hoja de cálculo.");

  const valoresEncabezado = hoja.getRow(1).values as unknown[];
  const encabezados = valoresEncabezado.slice(1).map((h) => (h ?? "").toString());

  const idxBloque = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.bloque);
  const idxApartamento = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.apartamento);
  const idxNombre = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.nombrePropietario);
  const idxCoeficiente = encontrarColumna(encabezados, ALIAS_ENCABEZADOS.coeficiente);

  if (idxApartamento === -1 || idxNombre === -1 || idxCoeficiente === -1) {
    throw new Error(
      "No se encontraron las columnas esperadas. El archivo debe tener: Apartamento, Nombre del propietario y Coeficiente (Bloque es opcional)."
    );
  }

  const filas: FilaImportada[] = [];

  hoja.eachRow((row, numeroFila) => {
    if (numeroFila === 1) return;
    const valores = row.values as unknown[];
    const obtener = (idx: number) => (idx === -1 ? undefined : valores[idx + 1]);

    const apartamento = obtener(idxApartamento);
    const nombre = obtener(idxNombre);
    if (apartamento == null && nombre == null) return;

    const bloqueCrudo = obtener(idxBloque);
    const coefCrudo = obtener(idxCoeficiente);
    const coeficiente =
      typeof coefCrudo === "number" ? coefCrudo : parseFloat(String(coefCrudo ?? "").replace(",", "."));

    filas.push({
      bloque: bloqueCrudo ? String(bloqueCrudo).trim() || "1" : "1",
      apartamento: String(apartamento ?? "").trim(),
      nombrePropietario: String(nombre ?? "").trim(),
      coeficiente: Number.isFinite(coeficiente) ? coeficiente : 0,
    });
  });

  return filas;
}
