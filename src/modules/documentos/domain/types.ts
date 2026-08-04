export type RolDocumento = "admin_copropiedad" | "consejero" | "propietario";

export interface CategoriaDocumento {
  id: string;
  nombre: string;
  activo: boolean;
  roles: RolDocumento[];
}

export type CategoriaDocumentoInput = Omit<CategoriaDocumento, "id">;

export interface Documento {
  id: string;
  copropiedadId: string;
  categoriaDocumentoId: string;
  titulo: string;
  fechaElaboracion: string;
  archivoPath: string;
  subidoPor: string | null;
}

export interface DocumentoInput {
  copropiedadId: string;
  categoriaDocumentoId: string;
  titulo: string;
  fechaElaboracion: string;
}
