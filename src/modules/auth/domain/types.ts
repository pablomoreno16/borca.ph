// Roles globales (sin copropiedad_id en perfil_rol) vs. scoped (siempre
// llevan copropiedad_id) — ver docs/architecture/03-autenticacion-autorizacion.md.
export type RolGlobal = "super_admin" | "site_owner";
export type RolScoped = "admin_copropiedad" | "consejero" | "propietario";
export type Rol = RolGlobal | RolScoped;

export const ROLES_GLOBALES: RolGlobal[] = ["super_admin", "site_owner"];
export const ROLES_SCOPED: RolScoped[] = ["admin_copropiedad", "consejero", "propietario"];

export interface Sesion {
  userId: string;
  email: string | null;
  roles: Rol[];
}

export function tieneAlgunRol(sesion: Sesion | null, roles: Rol[]): boolean {
  if (!sesion) return false;
  return sesion.roles.some((rol) => roles.includes(rol));
}
