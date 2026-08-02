import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type {
  CambiosUnidadEnLote,
  Copropiedad,
  CopropiedadInput,
  FilaImportada,
  PaginaUnidades,
  Persona,
  PersonaInput,
  PropietarioUnidad,
  UnidadPrivada,
  UnidadPrivadaInput,
} from "../domain/types";

type Fila = Tables<"copropiedad">;
type FilaUnidad = Tables<"unidad_privada">;

// Selección con el propietario actual embebido (join a través de la FK
// propietario.unidad_privada_id) para mostrar su nombre sin una consulta
// aparte por unidad.
const SELECT_UNIDAD_CON_PROPIETARIO = "*, propietario(fecha_fin, fecha_inicio, persona(nombre))";

type FilaUnidadConPropietario = FilaUnidad & {
  propietario: { fecha_fin: string | null; fecha_inicio: string; persona: { nombre: string } | null }[] | null;
};

function aDominio(fila: Fila): Copropiedad {
  return {
    id: fila.id,
    nombre: fila.nombre,
    tipo: fila.tipo as Copropiedad["tipo"],
    nit: fila.nit,
    direccion: fila.direccion,
    ciudad: fila.ciudad,
    telefono: fila.telefono,
    banco: fila.banco,
    tipoCuenta: fila.tipo_cuenta as Copropiedad["tipoCuenta"],
    numeroCuenta: fila.numero_cuenta,
    correo: fila.correo,
    estado: fila.estado as Copropiedad["estado"],
  };
}

function aFila(input: CopropiedadInput) {
  return {
    nombre: input.nombre,
    tipo: input.tipo,
    nit: input.nit,
    direccion: input.direccion,
    ciudad: input.ciudad,
    telefono: input.telefono,
    banco: input.banco,
    tipo_cuenta: input.tipoCuenta,
    numero_cuenta: input.numeroCuenta,
    correo: input.correo,
    estado: input.estado,
  };
}

// El propietario "actual" es el que no tiene fecha_fin; si por algún motivo
// hay más de uno sin cerrar, se toma el de fecha_inicio más reciente.
function unidadADominio(fila: FilaUnidadConPropietario): UnidadPrivada {
  const propietarios = fila.propietario ?? [];
  const actual =
    propietarios.find((p) => p.fecha_fin === null) ??
    [...propietarios].sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))[0];
  return {
    id: fila.id,
    copropiedadId: fila.copropiedad_id,
    bloque: fila.bloque,
    identificador: fila.identificador,
    tipo: fila.tipo as UnidadPrivada["tipo"],
    coeficiente: fila.coeficiente,
    propietarioNombre: actual?.persona?.nombre ?? null,
  };
}

export async function listarCopropiedades(): Promise<Copropiedad[]> {
  const { data, error } = await supabase.from("copropiedad").select("*").order("nombre", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(aDominio);
}

export async function obtenerCopropiedad(id: string): Promise<Copropiedad> {
  const { data, error } = await supabase.from("copropiedad").select("*").eq("id", id).single();
  if (error) throw error;
  return aDominio(data);
}

export async function crearCopropiedad(input: CopropiedadInput): Promise<Copropiedad> {
  const { data, error } = await supabase.from("copropiedad").insert(aFila(input)).select().single();
  if (error) throw error;
  return aDominio(data);
}

export async function actualizarCopropiedad(id: string, input: CopropiedadInput): Promise<Copropiedad> {
  const { data, error } = await supabase
    .from("copropiedad")
    .update(aFila(input))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return aDominio(data);
}

type FilaUnidadVista = Tables<"unidad_privada_detalle">;

function unidadVistaADominio(fila: FilaUnidadVista): UnidadPrivada {
  return {
    id: fila.id!,
    copropiedadId: fila.copropiedad_id!,
    bloque: fila.bloque!,
    identificador: fila.identificador!,
    tipo: fila.tipo as UnidadPrivada["tipo"],
    coeficiente: fila.coeficiente!,
    propietarioNombre: fila.nombre_propietario,
  };
}

interface OpcionesPaginaUnidades {
  pagina: number;
  porPagina: number;
  filtro?: string;
}

// unidad_privada_detalle: vista que ya trae el nombre del propietario actual
// aplanado en la fila — PostgREST no permite un .or() que combine una
// columna propia con una del embed relacionado, así que filtrar por
// "# de apartamento o nombre del propietario" a la vez necesita esta vista.
export async function listarUnidadesPaginadas(
  copropiedadId: string,
  { pagina, porPagina, filtro }: OpcionesPaginaUnidades
): Promise<PaginaUnidades> {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let consulta = supabase
    .from("unidad_privada_detalle")
    .select("*", { count: "exact" })
    .eq("copropiedad_id", copropiedadId);

  const termino = filtro?.trim().replace(/[,()]/g, "");
  if (termino) {
    consulta = consulta.or(`identificador.ilike.%${termino}%,nombre_propietario.ilike.%${termino}%`);
  }

  const { data, error, count } = await consulta
    .order("bloque", { ascending: true })
    .order("identificador", { ascending: true })
    .range(desde, hasta);
  if (error) throw error;

  return { items: (data ?? []).map(unidadVistaADominio), total: count ?? 0 };
}

export async function obtenerSumaCoeficientes(copropiedadId: string): Promise<number> {
  const { data, error } = await supabase.from("unidad_privada").select("coeficiente").eq("copropiedad_id", copropiedadId);
  if (error) throw error;
  return (data ?? []).reduce((acc, fila) => acc + fila.coeficiente, 0);
}

type FilaPropietarioConPersona = Tables<"propietario"> & { persona: { nombre: string } | null };

// Una unidad puede tener varios propietarios (copropiedad entre varias
// personas, o historial con fecha_fin). Se muestran todos, sin paginar:
// en la práctica son pocos por unidad.
export async function listarPropietariosDeUnidad(unidadId: string): Promise<PropietarioUnidad[]> {
  const { data, error } = await supabase
    .from("propietario")
    .select("*, persona(nombre)")
    .eq("unidad_privada_id", unidadId)
    .order("fecha_fin", { ascending: true, nullsFirst: true })
    .order("fecha_inicio", { ascending: false });
  if (error) throw error;

  return ((data ?? []) as FilaPropietarioConPersona[]).map((fila) => ({
    id: fila.id,
    nombre: fila.persona?.nombre ?? "—",
    porcentajeParticipacion: fila.porcentaje_participacion,
    fechaInicio: fila.fecha_inicio,
    fechaFin: fila.fecha_fin,
  }));
}

function personaADominio(fila: Tables<"persona">): Persona {
  return {
    id: fila.id,
    tipoDocumento: fila.tipo_documento,
    numeroDocumento: fila.numero_documento,
    nombre: fila.nombre,
    correo: fila.email,
    telefono: fila.telefono,
  };
}

function personaAFila(input: PersonaInput) {
  return {
    tipo_documento: input.tipoDocumento,
    numero_documento: input.numeroDocumento,
    nombre: input.nombre,
    email: input.correo,
    telefono: input.telefono,
  };
}

// Busca por el par (tipo_documento, numero_documento), que es único en
// persona. null si no existe nadie con ese documento.
export async function buscarPersonaPorDocumento(tipoDocumento: string, numeroDocumento: string): Promise<Persona | null> {
  const { data, error } = await supabase
    .from("persona")
    .select("*")
    .eq("tipo_documento", tipoDocumento)
    .eq("numero_documento", numeroDocumento)
    .maybeSingle();
  if (error) throw error;
  return data ? personaADominio(data) : null;
}

// El documento puede estar vacío (propietarios cargados por import masivo
// sin cédula/NIT), así que también hay que poder buscar por nombre.
// Coincidencia parcial e insensible a mayúsculas — puede haber varios
// resultados si el nombre no es único.
export async function buscarPersonasPorNombre(texto: string): Promise<Persona[]> {
  const { data, error } = await supabase
    .from("persona")
    .select("*")
    .ilike("nombre", `%${texto}%`)
    .order("nombre", { ascending: true })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map(personaADominio);
}

export async function crearPersona(input: PersonaInput): Promise<Persona> {
  const { data, error } = await supabase.from("persona").insert(personaAFila(input)).select().single();
  if (error) throw error;
  return personaADominio(data);
}

export async function actualizarPersona(id: string, input: PersonaInput): Promise<Persona> {
  const { data, error } = await supabase.from("persona").update(personaAFila(input)).eq("id", id).select().single();
  if (error) throw error;
  return personaADominio(data);
}

export async function agregarPropietario(
  unidadId: string,
  personaId: string,
  porcentajeParticipacion: number
): Promise<void> {
  const { error } = await supabase
    .from("propietario")
    .insert({ unidad_privada_id: unidadId, persona_id: personaId, porcentaje_participacion: porcentajeParticipacion });
  if (error) throw error;
}

// Solo cuenta los propietarios activos (sin fecha_fin): es la base sobre la
// que se calcula "% de participación total" al agregar uno nuevo.
export async function obtenerSumaParticipacionActiva(unidadId: string): Promise<number> {
  const { data, error } = await supabase
    .from("propietario")
    .select("porcentaje_participacion")
    .eq("unidad_privada_id", unidadId)
    .is("fecha_fin", null);
  if (error) throw error;
  return (data ?? []).reduce((acc, fila) => acc + (fila.porcentaje_participacion ?? 0), 0);
}

export async function obtenerUnidad(id: string): Promise<UnidadPrivada> {
  const { data, error } = await supabase
    .from("unidad_privada")
    .select(SELECT_UNIDAD_CON_PROPIETARIO)
    .eq("id", id)
    .single();
  if (error) throw error;
  return unidadADominio(data);
}

export async function actualizarUnidad(id: string, input: UnidadPrivadaInput): Promise<UnidadPrivada> {
  const { data, error } = await supabase
    .from("unidad_privada")
    .update({
      bloque: input.bloque,
      identificador: input.identificador,
      tipo: input.tipo,
      coeficiente: input.coeficiente,
    })
    .eq("id", id)
    .select(SELECT_UNIDAD_CON_PROPIETARIO)
    .single();
  if (error) throw error;
  return unidadADominio(data);
}

export async function actualizarUnidadesEnLote(ids: string[], cambios: CambiosUnidadEnLote): Promise<void> {
  const cambiosFila: { tipo?: string; coeficiente?: number } = {};
  if (cambios.tipo !== undefined) cambiosFila.tipo = cambios.tipo;
  if (cambios.coeficiente !== undefined) cambiosFila.coeficiente = cambios.coeficiente;

  const { error } = await supabase.from("unidad_privada").update(cambiosFila).in("id", ids);
  if (error) throw error;
}

// Borra primero los propietario ligados a la unidad (la FK no tiene cascade)
// y luego la unidad. No borra la persona: podría tener otras unidades.
export async function eliminarUnidad(id: string): Promise<void> {
  const { error: errorPropietarios } = await supabase.from("propietario").delete().eq("unidad_privada_id", id);
  if (errorPropietarios) throw errorPropietarios;

  const { error } = await supabase.from("unidad_privada").delete().eq("id", id);
  if (error) throw error;
}

export async function existenUnidadesEnCopropiedad(copropiedadId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("unidad_privada")
    .select("id", { count: "exact", head: true })
    .eq("copropiedad_id", copropiedadId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

// El import reemplaza TODAS las unidades de la copropiedad por las del
// Excel (no las combina): borra propietario + unidad_privada existentes y
// crea todo de nuevo. Los propietarios se resuelven por nombre sin
// distinguir mayúsculas — si ya existe una persona con ese nombre se
// reutiliza (puede ser dueña de varias unidades: un apartamento, un
// parqueadero, un cuarto útil), si no se crea una persona nueva. Cuando una
// fila trae varios propietarios (co-propiedad), el % de participación se
// reparte en partes iguales entre ellos.
export async function importarUnidades(copropiedadId: string, filas: FilaImportada[]): Promise<void> {
  const { data: unidadesExistentes, error: errorExistentes } = await supabase
    .from("unidad_privada")
    .select("id")
    .eq("copropiedad_id", copropiedadId);
  if (errorExistentes) throw errorExistentes;

  if (unidadesExistentes && unidadesExistentes.length > 0) {
    const idsExistentes = unidadesExistentes.map((u) => u.id);
    const { error: errorBorrarPropietarios } = await supabase
      .from("propietario")
      .delete()
      .in("unidad_privada_id", idsExistentes);
    if (errorBorrarPropietarios) throw errorBorrarPropietarios;

    const { error: errorBorrarUnidades } = await supabase
      .from("unidad_privada")
      .delete()
      .eq("copropiedad_id", copropiedadId);
    if (errorBorrarUnidades) throw errorBorrarUnidades;
  }

  const { data: personasExistentes, error: errorPersonasExistentes } = await supabase
    .from("persona")
    .select("id, nombre");
  if (errorPersonasExistentes) throw errorPersonasExistentes;

  const idPorNombre = new Map<string, string>(
    (personasExistentes ?? []).map((p) => [p.nombre.trim().toLowerCase(), p.id])
  );

  const nombresUnicos = new Set<string>();
  filas.forEach((f) => f.propietarios.forEach((nombre) => nombresUnicos.add(nombre)));
  const nombresNuevos = Array.from(nombresUnicos).filter((nombre) => !idPorNombre.has(nombre.trim().toLowerCase()));

  if (nombresNuevos.length > 0) {
    const { data: personasCreadas, error: errorCrearPersonas } = await supabase
      .from("persona")
      .insert(nombresNuevos.map((nombre) => ({ nombre })))
      .select("id, nombre");
    if (errorCrearPersonas) throw errorCrearPersonas;
    (personasCreadas ?? []).forEach((p) => idPorNombre.set(p.nombre.trim().toLowerCase(), p.id));
  }

  const { data: unidadesCreadas, error: errorUnidades } = await supabase
    .from("unidad_privada")
    .insert(
      filas.map((f) => ({
        copropiedad_id: copropiedadId,
        bloque: f.bloque,
        identificador: f.apartamento,
        tipo: f.tipo!,
        coeficiente: f.coeficiente,
      }))
    )
    .select("id");
  if (errorUnidades) throw errorUnidades;

  const filasPropietarios = filas.flatMap((f, i) => {
    const unidadId = unidadesCreadas![i].id;
    const porcentaje = 100 / f.propietarios.length;
    return f.propietarios.map((nombre) => ({
      persona_id: idPorNombre.get(nombre.trim().toLowerCase())!,
      unidad_privada_id: unidadId,
      porcentaje_participacion: porcentaje,
    }));
  });

  const { error: errorPropietarios } = await supabase.from("propietario").insert(filasPropietarios);
  if (errorPropietarios) throw errorPropietarios;
}

// Para el botón "Exportar": misma forma de columnas que el import (Torre,
// Apartamento, Tipo, Coeficiente, Propietario 1-3). Solo incluye
// propietarios activos (sin fecha_fin); si hay más de 3 se truncan porque
// el formato del archivo solo tiene 3 columnas de propietario.
export async function listarUnidadesParaExportar(copropiedadId: string): Promise<
  { bloque: string; identificador: string; tipo: UnidadPrivada["tipo"]; coeficiente: number; propietarios: string[] }[]
> {
  const { data, error } = await supabase
    .from("unidad_privada")
    .select(SELECT_UNIDAD_CON_PROPIETARIO)
    .eq("copropiedad_id", copropiedadId)
    .order("bloque", { ascending: true })
    .order("identificador", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as FilaUnidadConPropietario[]).map((fila) => ({
    bloque: fila.bloque,
    identificador: fila.identificador,
    tipo: fila.tipo as UnidadPrivada["tipo"],
    coeficiente: fila.coeficiente,
    propietarios: (fila.propietario ?? [])
      .filter((p) => p.fecha_fin === null)
      .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))
      .slice(0, 3)
      .map((p) => p.persona?.nombre ?? "")
      .filter(Boolean),
  }));
}
