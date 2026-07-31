export type TipoCarrusel = "promocion" | "evento" | "anuncio";

export interface CarruselItem {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoCarrusel;
  orden: number;
  activo: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
}

export type CarruselItemInput = Omit<CarruselItem, "id">;
