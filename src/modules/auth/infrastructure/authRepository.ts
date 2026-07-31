import { supabase } from "@/shared/supabase/client";
import type { Rol } from "../domain/types";

export async function iniciarSesion(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function cerrarSesion(): Promise<void> {
  await supabase.auth.signOut();
}

export async function obtenerRolesDeUsuario(authUserId: string): Promise<Rol[]> {
  const { data: perfil, error: perfilError } = await supabase
    .from("perfil")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (perfilError) throw perfilError;
  if (!perfil) return [];

  const { data: roles, error: rolesError } = await supabase
    .from("perfil_rol")
    .select("rol")
    .eq("perfil_id", perfil.id);
  if (rolesError) throw rolesError;

  return (roles ?? []).map((fila) => fila.rol as Rol);
}
