export type EstadoCopropiedad = "activa" | "inactiva";
export type TipoCuenta = "ahorros" | "corriente";
export type TipoCopropiedad = "residencial" | "comercial" | "mixta";

export interface Copropiedad {
  id: string;
  nombre: string;
  tipo: TipoCopropiedad;
  nit: string | null;
  direccion: string | null;
  ciudad: string | null;
  telefono: string | null;
  banco: string | null;
  tipoCuenta: TipoCuenta | null;
  numeroCuenta: string | null;
  correo: string | null;
  estado: EstadoCopropiedad;
}

export type CopropiedadInput = Omit<Copropiedad, "id">;

export interface FilaImportada {
  bloque: string;
  apartamento: string;
  nombrePropietario: string;
  coeficiente: number;
}

export interface ResumenImportacion {
  totalFilas: number;
  sumaCoeficientes: number;
  diferencia: number;
  esValida: boolean;
  errores: string[];
  escalaConvertida: boolean;
}

export type TipoUnidad = "apartamento" | "parqueadero" | "deposito" | "local" | "oficina";

export interface UnidadPrivada {
  id: string;
  copropiedadId: string;
  bloque: string;
  identificador: string;
  tipo: TipoUnidad;
  coeficiente: number;
  propietarioNombre: string | null;
}

export type UnidadPrivadaInput = Pick<UnidadPrivada, "bloque" | "identificador" | "tipo" | "coeficiente">;

export interface PaginaUnidades {
  items: UnidadPrivada[];
  total: number;
}

export interface PropietarioUnidad {
  id: string;
  nombre: string;
  porcentajeParticipacion: number | null;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface Persona {
  id: string;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  nombre: string;
  correo: string | null;
  telefono: string | null;
}

export type PersonaInput = Omit<Persona, "id">;
