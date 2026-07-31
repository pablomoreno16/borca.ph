import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type { Copropiedad, CopropiedadInput, FilaImportada } from "../domain/types";

type Fila = Tables<"copropiedad">;

function aDominio(fila: Fila): Copropiedad {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nit: fila.nit,
    direccion: fila.direccion,
    ciudad: fila.ciudad,
    telefono: fila.telefono,
    cuentaBancaria: fila.cuenta_bancaria,
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
    cuenta_bancaria: input.cuentaBancaria,
    correo: input.correo,
    estado: input.estado,
  };
}

export async function listarCopropiedades(): Promise<Copropiedad[]> {
  const { data, error } = await supabase.from("copropiedad").select("*").order("nombre", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(aDominio);
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

export async function contarUnidades(copropiedadId: string): Promise<number> {
  const { count, error } = await supabase
    .from("unidad_privada")
    .select("id", { count: "exact", head: true })
    .eq("copropiedad_id", copropiedadId);
  if (error) throw error;
  return count ?? 0;
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
