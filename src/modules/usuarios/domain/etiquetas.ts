import { ROLES_GLOBALES, ROLES_SCOPED, type Rol } from "@/modules/auth/domain/types";

export const ROL_LABEL: Record<Rol, string> = {
  super_admin: "Super administrador",
  site_owner: "Administrador del sitio",
  admin_copropiedad: "Administrador de copropiedad",
  consejero: "Consejero",
  propietario: "Propietario",
};

export const ROLES_ORDENADOS: Rol[] = [...ROLES_GLOBALES, ...ROLES_SCOPED];
