import type { Rol } from "@/modules/auth/domain/types";

export interface RolAsignado {
  id: string;
  rol: Rol;
  copropiedadId: string | null;
  // Resuelto en el join, solo para mostrar en la UI.
  copropiedadNombre: string | null;
}

export interface PerfilConRoles {
  perfilId: string;
  personaId: string;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  roles: RolAsignado[];
}

// Una fila por relación de propiedad activa (persona + unidad) de una
// copropiedad — para la tabla "Usuarios" del detalle de copropiedad, que
// muestra a todos los propietarios tengan o no cuenta todavía.
export interface UsuarioUnidad {
  personaId: string;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  unidadBloque: string;
  unidadIdentificador: string;
  porcentajeParticipacion: number | null;
  tienePerfil: boolean;
  // Roles scoped a esta copropiedad únicamente (vacío si no tiene cuenta
  // o tiene cuenta pero ningún rol asignado aquí todavía).
  roles: Rol[];
}
