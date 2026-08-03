import { describe, expect, it } from "vitest";
import { validarCarruselItem } from "@/modules/carrusel/domain/validacion";
import type { CarruselItemInput } from "@/modules/carrusel/domain/types";

const itemValido: CarruselItemInput = {
  titulo: "Promoción de bienvenida",
  descripcion: null,
  tipo: "promocion",
  orden: 1,
  activo: true,
  fechaInicio: null,
  fechaFin: null,
  ctaLabel: null,
  ctaHref: null,
};

describe("validarCarruselItem", () => {
  it("no tiene errores con datos válidos", () => {
    expect(validarCarruselItem(itemValido)).toEqual([]);
  });

  it("exige el título", () => {
    const errores = validarCarruselItem({ ...itemValido, titulo: "  " });
    expect(errores).toContain("El título es obligatorio.");
  });

  it("exige el destino si se define el texto del botón", () => {
    const errores = validarCarruselItem({ ...itemValido, ctaLabel: "Ver más", ctaHref: null });
    expect(errores).toContain("Si defines el texto del botón, también debes definir su destino (y viceversa).");
  });

  it("exige el texto del botón si se define el destino", () => {
    const errores = validarCarruselItem({ ...itemValido, ctaLabel: null, ctaHref: "/contacto" });
    expect(errores).toContain("Si defines el texto del botón, también debes definir su destino (y viceversa).");
  });

  it("no exige nada si ninguno de los dos está definido", () => {
    const errores = validarCarruselItem({ ...itemValido, ctaLabel: null, ctaHref: null });
    expect(errores).toEqual([]);
  });

  it("no tiene errores si ambos del CTA están definidos", () => {
    const errores = validarCarruselItem({ ...itemValido, ctaLabel: "Ver más", ctaHref: "/contacto" });
    expect(errores).toEqual([]);
  });

  it("rechaza fecha de inicio posterior a la fecha de fin", () => {
    const errores = validarCarruselItem({ ...itemValido, fechaInicio: "2026-08-10", fechaFin: "2026-08-01" });
    expect(errores).toContain("La fecha de inicio no puede ser posterior a la fecha de fin.");
  });

  it("acepta fecha de inicio igual o anterior a la fecha de fin", () => {
    expect(validarCarruselItem({ ...itemValido, fechaInicio: "2026-08-01", fechaFin: "2026-08-01" })).toEqual([]);
    expect(validarCarruselItem({ ...itemValido, fechaInicio: "2026-08-01", fechaFin: "2026-08-10" })).toEqual([]);
  });
});
