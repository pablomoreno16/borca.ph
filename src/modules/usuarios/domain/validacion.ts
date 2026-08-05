import { ROLES_SCOPED, type Rol } from "@/modules/auth/domain/types";

export function validarNuevoRol(rol: Rol, copropiedadId: string | null): string[] {
  const errores: string[] = [];
  const esScoped = (ROLES_SCOPED as Rol[]).includes(rol);
  if (esScoped && !copropiedadId) {
    errores.push("Selecciona una copropiedad para este rol.");
  }
  if (!esScoped && copropiedadId) {
    errores.push("Los roles globales no llevan copropiedad.");
  }
  return errores;
}
