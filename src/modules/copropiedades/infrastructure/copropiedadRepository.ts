import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type { Copropiedad, CopropiedadInput, FilaImportada, PaginaUnidades, UnidadPrivada } from "../domain/types";

type Fila = Tables<"copropiedad">;
type FilaUnidad = Tables<"unidad_privada">;

function aDominio(fila: Fila): Copropiedad {
  return {
    id: fila.id,
    nombre: fila.nombre,
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

function unidadADominio(fila: FilaUnidad): UnidadPrivada {
  return {
    id: fila.id,
    copropiedadId: fila.copropiedad_id,
    bloque: fila.bloque,
    identificador: fila.identificador,
    tipo: fila.tipo as UnidadPrivada["tipo"],
    coeficiente: fila.coeficiente,
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

interface OpcionesPaginaUnidades {
  pagina: number;
  porPagina: number;
  filtroApartamento?: string;
}

export async function listarUnidadesPaginadas(
  copropiedadId: string,
  { pagina, porPagina, filtroApartamento }: OpcionesPaginaUnidades
): Promise<PaginaUnidades> {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let consulta = supabase
    .from("unidad_privada")
    .select("*", { count: "exact" })
    .eq("copropiedad_id", copropiedadId);

  if (filtroApartamento?.trim()) {
    consulta = consulta.ilike("identificador", `%${filtroApartamento.trim()}%`);
  }

  const { data, error, count } = await consulta
    .order("bloque", { ascending: true })
    .order("identificador", { ascending: true })
    .range(desde, hasta);
  if (error) throw error;

  return { items: (data ?? []).map(unidadADominio), total: count ?? 0 };
}

// Crea persona + unidad_privada + propietario para cada fila del Excel, en
// tres inserts por lote (no uno por fila) para que importar decenas o
// cientos de unidades sea rápido. Postgres devuelve las filas de un mismo
// INSERT ... VALUES en el mismo orden en que se insertaron, así que los
// índices se correlacionan entre los tres lotes.
export async function importarUnidades(copropiedadId: string, filas: FilaImportada[]): Promise<void> {
  const { data: personas, error: errorPersonas } = await supabase
    .from("persona")
    .insert(filas.map((f) => ({ nombre: f.nombrePropietario })))
    .select("id");
  if (errorPersonas) throw errorPersonas;

  const { data: unidades, error: errorUnidades } = await supabase
    .from("unidad_privada")
    .insert(
      filas.map((f) => ({
        copropiedad_id: copropiedadId,
        bloque: f.bloque,
        identificador: f.apartamento,
        coeficiente: f.coeficiente,
      }))
    )
    .select("id");
  if (errorUnidades) throw errorUnidades;

  const { error: errorPropietarios } = await supabase.from("propietario").insert(
    filas.map((_, i) => ({
      persona_id: personas![i].id,
      unidad_privada_id: unidades![i].id,
      porcentaje_participacion: 100,
    }))
  );
  if (errorPropietarios) throw errorPropietarios;
}
