import type { CarruselItemInput } from "./types";

export function validarCarruselItem(input: CarruselItemInput): string[] {
  const errores: string[] = [];

  if (!input.titulo.trim()) errores.push("El título es obligatorio.");

  const tieneCtaLabel = !!input.ctaLabel?.trim();
  const tieneCtaHref = !!input.ctaHref?.trim();
  if (tieneCtaLabel !== tieneCtaHref) {
    errores.push("Si defines el texto del botón, también debes definir su destino (y viceversa).");
  }

  if (input.fechaInicio && input.fechaFin && input.fechaInicio > input.fechaFin) {
    errores.push("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }

  return errores;
}
