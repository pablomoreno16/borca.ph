import type { CategoriaDocumentoInput, DocumentoInput } from "./types";

export function validarCategoria(input: CategoriaDocumentoInput): string[] {
  const errores: string[] = [];
  if (!input.nombre.trim()) errores.push("El nombre es obligatorio.");
  return errores;
}

export function validarDocumento(input: DocumentoInput): string[] {
  const errores: string[] = [];
  if (!input.categoriaDocumentoId) errores.push("La categoría es obligatoria.");
  if (!input.titulo.trim()) errores.push("El título es obligatorio.");
  if (!input.fechaElaboracion) errores.push("La fecha de elaboración es obligatoria.");
  return errores;
}

// Mismos límites que el bucket de Storage (supabase/migrations/..._fase2_1_documentos.sql)
// — se validan también en el cliente para dar el error antes de intentar subir.
export const TIPOS_ARCHIVO_PERMITIDOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export const TAMANO_MAXIMO_ARCHIVO_BYTES = 20 * 1024 * 1024;

export function validarArchivoDocumento(archivo: File): string[] {
  const errores: string[] = [];
  if (!TIPOS_ARCHIVO_PERMITIDOS.includes(archivo.type)) {
    errores.push("Tipo de archivo no permitido (solo PDF, Word o imágenes).");
  }
  if (archivo.size > TAMANO_MAXIMO_ARCHIVO_BYTES) {
    errores.push("El archivo supera el tamaño máximo permitido (20 MB).");
  }
  return errores;
}

// Las keys de Supabase Storage solo permiten un set ASCII restringido —
// tildes, ñ, espacios y otros caracteres del nombre original del archivo
// (ej. "Solicitud Crédito.pdf") producen "Invalid key" al subir.
export function sanitizarNombreArchivo(nombre: string): string {
  const sinAcentos = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return sinAcentos.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}
