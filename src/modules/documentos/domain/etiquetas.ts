import type { RolDocumento } from "./types";

export const ROL_DOCUMENTO_LABEL: Record<RolDocumento, string> = {
  admin_copropiedad: "Administrador de copropiedad",
  consejero: "Consejero",
  propietario: "Propietario",
};

export const ROLES_DOCUMENTO: RolDocumento[] = ["admin_copropiedad", "consejero", "propietario"];
