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

export type TipoUnidad = "apartamento" | "cuarto_util" | "deposito" | "local" | "oficina" | "parqueadero";

// Hasta 3 propietarios por fila (columnas "Propietario 1/2/3" del Excel);
// el primero es obligatorio, los otros dos opcionales para co-propiedad.
export interface FilaImportada {
  bloque: string;
  apartamento: string;
  tipo: TipoUnidad | null;
  coeficiente: number;
  propietarios: string[];
}

export interface ResumenImportacion {
  totalFilas: number;
  sumaCoeficientes: number;
  diferencia: number;
  esValida: boolean;
  errores: string[];
  escalaConvertida: boolean;
}

export interface UnidadPrivada {
  id: string;
  copropiedadId: string;
  bloque: string;
  identificador: string;
  tipo: TipoUnidad;
  coeficiente: number;
  propietariosNombres: string | null;
}

export type UnidadPrivadaInput = Pick<UnidadPrivada, "bloque" | "identificador" | "tipo" | "coeficiente">;

// Edición masiva: solo se aplican los campos presentes (undefined = no
// tocar ese campo en las unidades seleccionadas).
export interface CambiosUnidadEnLote {
  tipo?: TipoUnidad;
  coeficiente?: number;
}

export interface PaginaUnidades {
  items: UnidadPrivada[];
  total: number;
}

export interface PropietarioUnidad {
  id: string;
  personaId: string;
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
