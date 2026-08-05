import { supabase } from "@/shared/supabase/client";
import type { Tables } from "@/shared/supabase/database.types";
import type { Rol } from "@/modules/auth/domain/types";
import type { PerfilConRoles, RolAsignado, UsuarioUnidad } from "../domain/types";

type FilaPersona = Tables<"persona">;

function personaAPerfilBase(perfilId: string, persona: FilaPersona): Omit<PerfilConRoles, "roles"> {
  return {
    perfilId,
    personaId: persona.id,
    tipoDocumento: persona.tipo_documento,
    numeroDocumento: persona.numero_documento,
    nombre: persona.nombre,
    correo: persona.email,
    telefono: persona.telefono,
  };
}

type FilaPerfilConRoles = Tables<"perfil"> & {
  persona: FilaPersona;
  perfil_rol: (Tables<"perfil_rol"> & { copropiedad: { nombre: string } | null })[] | null;
};

function filaARolAsignado(fila: Tables<"perfil_rol"> & { copropiedad: { nombre: string } | null }): RolAsignado {
  return {
    id: fila.id,
    rol: fila.rol as Rol,
    copropiedadId: fila.copropiedad_id,
    copropiedadNombre: fila.copropiedad?.nombre ?? null,
  };
}

// Listado global: todos los perfiles del sistema con todos sus roles
// (incluye perfiles sin ningún rol todavía, para poder detectarlos).
export async function listarPerfiles(): Promise<PerfilConRoles[]> {
  const { data, error } = await supabase
    .from("perfil")
    .select("*, persona(*), perfil_rol(*, copropiedad(nombre))")
    .order("created_at", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as FilaPerfilConRoles[]).map((fila) => ({
    ...personaAPerfilBase(fila.id, fila.persona),
    roles: (fila.perfil_rol ?? []).map(filaARolAsignado),
  }));
}

type FilaPropietarioConUnidad = Tables<"propietario"> & {
  persona: FilaPersona;
  unidad_privada: { bloque: string; identificador: string; copropiedad_id: string };
};

// Todos los propietarios (con o sin cuenta todavía) de las unidades de una
// copropiedad — para la pestaña "Usuarios" del detalle de copropiedad. Una
// fila por relación de propiedad activa (persona + unidad).
export async function listarUsuariosDeCopropiedad(copropiedadId: string): Promise<UsuarioUnidad[]> {
  const { data: propietarios, error: errorPropietarios } = await supabase
    .from("propietario")
    .select("*, persona(*), unidad_privada!inner(bloque, identificador, copropiedad_id)")
    .is("fecha_fin", null)
    .eq("unidad_privada.copropiedad_id", copropiedadId);
  if (errorPropietarios) throw errorPropietarios;

  const filas = (propietarios ?? []) as FilaPropietarioConUnidad[];
  const personaIds = Array.from(new Set(filas.map((f) => f.persona_id)));

  const perfilesPorPersona = new Map<string, { tienePerfil: boolean; roles: Rol[] }>();
  if (personaIds.length > 0) {
    const { data: perfiles, error: errorPerfiles } = await supabase
      .from("perfil")
      .select("persona_id, perfil_rol(rol, copropiedad_id)")
      .in("persona_id", personaIds);
    if (errorPerfiles) throw errorPerfiles;

    for (const fila of (perfiles ?? []) as { persona_id: string; perfil_rol: { rol: string; copropiedad_id: string | null }[] | null }[]) {
      const roles = (fila.perfil_rol ?? [])
        .filter((r) => r.copropiedad_id === copropiedadId)
        .map((r) => r.rol as Rol);
      perfilesPorPersona.set(fila.persona_id, { tienePerfil: true, roles });
    }
  }

  return filas.map((fila) => {
    const perfilInfo = perfilesPorPersona.get(fila.persona_id);
    return {
      personaId: fila.persona.id,
      tipoDocumento: fila.persona.tipo_documento,
      numeroDocumento: fila.persona.numero_documento,
      nombre: fila.persona.nombre,
      correo: fila.persona.email,
      telefono: fila.persona.telefono,
      unidadBloque: fila.unidad_privada.bloque,
      unidadIdentificador: fila.unidad_privada.identificador,
      porcentajeParticipacion: fila.porcentaje_participacion,
      tienePerfil: perfilInfo?.tienePerfil ?? false,
      roles: perfilInfo?.roles ?? [],
    };
  });
}

export async function agregarRol(perfilId: string, rol: Rol, copropiedadId: string | null): Promise<string> {
  const { data, error } = await supabase
    .from("perfil_rol")
    .insert({ perfil_id: perfilId, rol, copropiedad_id: copropiedadId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function quitarRol(perfilRolId: string): Promise<void> {
  const { error } = await supabase.from("perfil_rol").delete().eq("id", perfilRolId);
  if (error) throw error;
}
