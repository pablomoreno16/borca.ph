import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type { CarruselItem, CarruselItemInput } from "../domain/types";

type Fila = Tables<"carrusel_item">;

function aDominio(fila: Fila): CarruselItem {
  return {
    id: fila.id,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    tipo: fila.tipo as CarruselItem["tipo"],
    orden: fila.orden,
    activo: fila.activo,
    fechaInicio: fila.fecha_inicio,
    fechaFin: fila.fecha_fin,
    ctaLabel: fila.cta_label,
    ctaHref: fila.cta_href,
  };
}

function aFila(input: CarruselItemInput) {
  return {
    titulo: input.titulo,
    descripcion: input.descripcion,
    tipo: input.tipo,
    orden: input.orden,
    activo: input.activo,
    fecha_inicio: input.fechaInicio,
    fecha_fin: input.fechaFin,
    cta_label: input.ctaLabel,
    cta_href: input.ctaHref,
  };
}

// Para el panel admin: RLS ya limita esto a site_owner/super_admin, y les
// muestra TODO (incluidos ítems inactivos/vencidos) para poder gestionarlos.
export async function listarItems(): Promise<CarruselItem[]> {
  const { data, error } = await supabase
    .from("carrusel_item")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(aDominio);
}

// Para el carrusel público del sitio: se filtra explícitamente por
// activo + vigencia en la propia consulta, sin depender solo de RLS. Si
// dependiéramos únicamente de RLS, un visitante que además esté logueado
// como site_owner/super_admin (misma sesión de navegador) vería ítems
// inactivos o vencidos en la home pública, porque la política RLS de
// administración le permite ver todo el carrusel.
export async function listarItemsPublicos(): Promise<CarruselItem[]> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("carrusel_item")
    .select("*")
    .eq("activo", true)
    .or(`fecha_inicio.is.null,fecha_inicio.lte.${hoy}`)
    .or(`fecha_fin.is.null,fecha_fin.gte.${hoy}`)
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(aDominio);
}

export async function crearItem(input: CarruselItemInput): Promise<CarruselItem> {
  const { data, error } = await supabase
    .from("carrusel_item")
    .insert(aFila(input))
    .select()
    .single();
  if (error) throw error;
  return aDominio(data);
}

export async function actualizarItem(id: string, input: CarruselItemInput): Promise<CarruselItem> {
  const { data, error } = await supabase
    .from("carrusel_item")
    .update(aFila(input))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return aDominio(data);
}

export async function eliminarItem(id: string): Promise<void> {
  const { error } = await supabase.from("carrusel_item").delete().eq("id", id);
  if (error) throw error;
}

export async function actualizarOrden(id: string, orden: number): Promise<void> {
  const { error } = await supabase.from("carrusel_item").update({ orden }).eq("id", id);
  if (error) throw error;
}
