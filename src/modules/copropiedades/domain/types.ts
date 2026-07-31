export type EstadoCopropiedad = "activa" | "inactiva";
export type TipoCuenta = "ahorros" | "corriente";

export interface Copropiedad {
  id: string;
  nombre: string;
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
}

export type TipoUnidad = "apartamento" | "parqueadero" | "deposito" | "local" | "oficina";

export interface UnidadPrivada {
  id: string;
  copropiedadId: string;
  bloque: string;
  identificador: string;
  tipo: TipoUnidad;
  coeficiente: number;
}

export interface PaginaUnidades {
  items: UnidadPrivada[];
  total: number;
}
