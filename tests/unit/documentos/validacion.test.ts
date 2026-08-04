import { describe, expect, it } from "vitest";
import {
  TAMANO_MAXIMO_ARCHIVO_BYTES,
  sanitizarNombreArchivo,
  validarArchivoDocumento,
  validarCategoria,
  validarDocumento,
} from "@/modules/documentos/domain/validacion";

describe("validarCategoria", () => {
  it("exige nombre", () => {
    expect(validarCategoria({ nombre: "", activo: true, roles: [] })).toEqual([
      "El nombre es obligatorio.",
    ]);
  });

  it("acepta un nombre válido", () => {
    expect(validarCategoria({ nombre: "Comunicado", activo: true, roles: [] })).toEqual([]);
  });
});

describe("validarDocumento", () => {
  const base = {
    copropiedadId: "cop-1",
    categoriaDocumentoId: "cat-1",
    titulo: "Acta 2026-01",
    fechaElaboracion: "2026-01-15",
  };

  it("acepta un documento completo", () => {
    expect(validarDocumento(base)).toEqual([]);
  });

  it("exige categoría", () => {
    expect(validarDocumento({ ...base, categoriaDocumentoId: "" })).toEqual([
      "La categoría es obligatoria.",
    ]);
  });

  it("exige título", () => {
    expect(validarDocumento({ ...base, titulo: "  " })).toEqual(["El título es obligatorio."]);
  });

  it("exige fecha de elaboración", () => {
    expect(validarDocumento({ ...base, fechaElaboracion: "" })).toEqual([
      "La fecha de elaboración es obligatoria.",
    ]);
  });

  it("acumula varios errores a la vez", () => {
    expect(validarDocumento({ ...base, titulo: "", fechaElaboracion: "" })).toHaveLength(2);
  });
});

describe("validarArchivoDocumento", () => {
  function archivo(type: string, size: number): File {
    return new File([new Uint8Array(size)], "documento", { type });
  }

  it("acepta un PDF dentro del límite de tamaño", () => {
    expect(validarArchivoDocumento(archivo("application/pdf", 1024))).toEqual([]);
  });

  it("rechaza un tipo de archivo no permitido", () => {
    expect(validarArchivoDocumento(archivo("application/zip", 1024))).toEqual([
      "Tipo de archivo no permitido (solo PDF, Word o imágenes).",
    ]);
  });

  it("rechaza un archivo que excede el tamaño máximo", () => {
    expect(validarArchivoDocumento(archivo("application/pdf", TAMANO_MAXIMO_ARCHIVO_BYTES + 1))).toEqual([
      "El archivo supera el tamaño máximo permitido (20 MB).",
    ]);
  });

  it("acepta un archivo justo en el límite de tamaño", () => {
    expect(validarArchivoDocumento(archivo("application/pdf", TAMANO_MAXIMO_ARCHIVO_BYTES))).toEqual([]);
  });
});

describe("sanitizarNombreArchivo", () => {
  it("quita tildes y eñes", () => {
    expect(sanitizarNombreArchivo("Solicitud Crédito Añadido.pdf")).toBe("Solicitud_Credito_Anadido.pdf");
  });

  it("reemplaza espacios por guión bajo", () => {
    expect(sanitizarNombreArchivo("acta reunion.pdf")).toBe("acta_reunion.pdf");
  });

  it("deja intactos los caracteres ya permitidos", () => {
    expect(sanitizarNombreArchivo("Reporte-Final_v2.pdf")).toBe("Reporte-Final_v2.pdf");
  });

  it("reemplaza otros caracteres no permitidos (paréntesis, símbolos)", () => {
    expect(sanitizarNombreArchivo("acta (final)#1.pdf")).toBe("acta__final__1.pdf");
  });
});
