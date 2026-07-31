export type Rol = "super_admin" | "site_owner";

export interface Sesion {
  userId: string;
  email: string | null;
  roles: Rol[];
}

export function tieneAlgunRol(sesion: Sesion | null, roles: Rol[]): boolean {
  if (!sesion) return false;
  return sesion.roles.some((rol) => roles.includes(rol));
}
