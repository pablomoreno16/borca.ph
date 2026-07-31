export type EstadoCopropiedad = "activa" | "inactiva";

export interface Copropiedad {
  id: string;
  nombre: string;
  nit: string | null;
  direccion: string | null;
  ciudad: string | null;
  telefono: string | null;
  cuentaBancaria: string | null;
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
