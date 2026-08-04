import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type {
  CategoriaDocumento,
  CategoriaDocumentoInput,
  Documento,
  DocumentoInput,
  RolDocumento,
} from "../domain/types";
import { sanitizarNombreArchivo } from "../domain/validacion";

const BUCKET = "documentos-copropiedad";

type FilaCategoria = Tables<"categoria_documento"> & {
  categoria_documento_rol: { rol: string }[] | null;
};
type FilaDocumento = Tables<"documento">;

function categoriaADominio(fila: FilaCategoria): CategoriaDocumento {
  return {
    id: fila.id,
    nombre: fila.nombre,
    activo: fila.activo,
    roles: (fila.categoria_documento_rol ?? []).map((r) => r.rol as RolDocumento),
  };
}

function documentoADominio(fila: FilaDocumento): Documento {
  return {
    id: fila.id,
    copropiedadId: fila.copropiedad_id,
    categoriaDocumentoId: fila.categoria_documento_id,
    titulo: fila.titulo,
    fechaElaboracion: fila.fecha_elaboracion,
    archivoPath: fila.archivo_path,
    subidoPor: fila.subido_por,
  };
}

export async function listarCategorias(): Promise<CategoriaDocumento[]> {
  const { data, error } = await supabase
    .from("categoria_documento")
    .select("*, categoria_documento_rol(rol)")
    .order("nombre", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as FilaCategoria[]).map(categoriaADominio);
}

async function reemplazarRolesDeCategoria(categoriaId: string, roles: RolDocumento[]): Promise<void> {
  const { error: errorBorrado } = await supabase
    .from("categoria_documento_rol")
    .delete()
    .eq("categoria_documento_id", categoriaId);
  if (errorBorrado) throw errorBorrado;

  if (roles.length === 0) return;
  const { error: errorInsercion } = await supabase
    .from("categoria_documento_rol")
    .insert(roles.map((rol) => ({ categoria_documento_id: categoriaId, rol })));
  if (errorInsercion) throw errorInsercion;
}

export async function crearCategoria(input: CategoriaDocumentoInput): Promise<CategoriaDocumento> {
  const { data, error } = await supabase
    .from("categoria_documento")
    .insert({ nombre: input.nombre, activo: input.activo })
    .select()
    .single();
  if (error) throw error;
  await reemplazarRolesDeCategoria(data.id, input.roles);
  return { id: data.id, nombre: data.nombre, activo: data.activo, roles: input.roles };
}

export async function actualizarCategoria(
  id: string,
  input: CategoriaDocumentoInput
): Promise<CategoriaDocumento> {
  const { data, error } = await supabase
    .from("categoria_documento")
    .update({ nombre: input.nombre, activo: input.activo })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await reemplazarRolesDeCategoria(id, input.roles);
  return { id: data.id, nombre: data.nombre, activo: data.activo, roles: input.roles };
}

export async function eliminarCategoria(id: string): Promise<void> {
  const { error } = await supabase.from("categoria_documento").delete().eq("id", id);
  if (error) throw error;
}

export async function listarDocumentosDeCopropiedad(copropiedadId: string): Promise<Documento[]> {
  const { data, error } = await supabase
    .from("documento")
    .select("*")
    .eq("copropiedad_id", copropiedadId)
    .order("fecha_elaboracion", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as FilaDocumento[]).map(documentoADominio);
}

function calcularArchivoPath(input: DocumentoInput, archivo: File): string {
  const nombreSeguro = sanitizarNombreArchivo(archivo.name);
  return `${input.copropiedadId}/${input.categoriaDocumentoId}/${crypto.randomUUID()}-${nombreSeguro}`;
}

async function subirArchivo(path: string, archivo: File): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, archivo);
  if (error) throw error;
}

async function eliminarArchivo(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function subirDocumento(input: DocumentoInput, archivo: File): Promise<Documento> {
  const path = calcularArchivoPath(input, archivo);
  await subirArchivo(path, archivo);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = user
    ? await supabase.from("perfil").select("id").eq("auth_user_id", user.id).maybeSingle()
    : { data: null };

  const { data, error } = await supabase
    .from("documento")
    .insert({
      copropiedad_id: input.copropiedadId,
      categoria_documento_id: input.categoriaDocumentoId,
      titulo: input.titulo,
      fecha_elaboracion: input.fechaElaboracion,
      archivo_path: path,
      subido_por: perfil?.id ?? null,
    })
    .select()
    .single();
  if (error) {
    await eliminarArchivo(path);
    throw error;
  }
  return documentoADominio(data);
}

// Sin versionado (decisión explícita): reemplazar el archivo sobrescribe
// archivo_path en la misma fila — el archivo anterior se borra del bucket.
export async function actualizarDocumento(
  id: string,
  input: DocumentoInput,
  archivoNuevo: File | null
): Promise<Documento> {
  const cambios: Partial<FilaDocumento> = {
    copropiedad_id: input.copropiedadId,
    categoria_documento_id: input.categoriaDocumentoId,
    titulo: input.titulo,
    fecha_elaboracion: input.fechaElaboracion,
  };

  let pathAnterior: string | null = null;
  if (archivoNuevo) {
    const { data: actual, error: errorActual } = await supabase
      .from("documento")
      .select("archivo_path")
      .eq("id", id)
      .single();
    if (errorActual) throw errorActual;
    pathAnterior = actual.archivo_path;

    const pathNuevo = calcularArchivoPath(input, archivoNuevo);
    await subirArchivo(pathNuevo, archivoNuevo);
    cambios.archivo_path = pathNuevo;
  }

  const { data, error } = await supabase.from("documento").update(cambios).eq("id", id).select().single();
  if (error) throw error;

  if (pathAnterior) await eliminarArchivo(pathAnterior);
  return documentoADominio(data);
}

export async function eliminarDocumento(id: string): Promise<void> {
  const { data, error: errorLectura } = await supabase
    .from("documento")
    .select("archivo_path")
    .eq("id", id)
    .single();
  if (errorLectura) throw errorLectura;

  const { error } = await supabase.from("documento").delete().eq("id", id);
  if (error) throw error;

  await eliminarArchivo(data.archivo_path);
}

export async function crearUrlFirmada(archivoPath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(archivoPath, 60);
  if (error) throw error;
  return data.signedUrl;
}
