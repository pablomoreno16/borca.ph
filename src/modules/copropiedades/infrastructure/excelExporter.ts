import ExcelJS from "exceljs";
import type { TipoUnidad } from "../domain/types";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";

export interface FilaExportable {
  bloque: string;
  identificador: string;
  tipo: TipoUnidad;
  coeficiente: number; // fracción 0-1, como se guarda internamente
  propietarios: string[];
}

const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Mismas columnas que espera el import (infrastructure/excelParser.ts),
// para que un archivo exportado se pueda volver a importar sin ajustes.
export async function generarExcelUnidades(filas: FilaExportable[]): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet("Unidades");

  hoja.columns = [
    { header: "Tipo", key: "tipo", width: 14 },
    { header: "Torre", key: "torre", width: 10 },
    { header: "Apartamento", key: "apartamento", width: 14 },
    { header: "Propietario 1", key: "propietario1", width: 28 },
    { header: "Propietario 2", key: "propietario2", width: 28 },
    { header: "Propietario 3", key: "propietario3", width: 28 },
    { header: "Coeficiente", key: "coeficiente", width: 14 },
  ];

  filas.forEach((fila) => {
    hoja.addRow({
      tipo: TIPO_UNIDAD_LABEL[fila.tipo],
      torre: fila.bloque,
      apartamento: fila.identificador,
      propietario1: fila.propietarios[0] ?? "",
      propietario2: fila.propietarios[1] ?? "",
      propietario3: fila.propietarios[2] ?? "",
      coeficiente: Number((fila.coeficiente * 100).toFixed(6)),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: MIME_XLSX });
}
