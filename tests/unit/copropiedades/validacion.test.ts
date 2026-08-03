import { describe, expect, it } from "vitest";
import {
  normalizarEscalaCoeficientes,
  validarCopropiedad,
  validarEdicionLote,
  validarFilasImportadas,
  validarPersona,
  validarPorcentajeParticipacion,
  validarUnidad,
} from "@/modules/copropiedades/domain/validacion";
import type { CopropiedadInput, FilaImportada, PersonaInput, UnidadPrivadaInput } from "@/modules/copropiedades/domain/types";

const copropiedadValida: CopropiedadInput = {
  nombre: "Torres del Parque",
  tipo: "residencial",
  nit: null,
  direccion: null,
  ciudad: null,
  telefono: null,
  banco: null,
  tipoCuenta: null,
  numeroCuenta: null,
  correo: null,
  estado: "activa",
};

const unidadValida: UnidadPrivadaInput = {
  bloque: "1",
  identificador: "101",
  tipo: "apartamento",
  coeficiente: 0.05,
};

const personaValida: PersonaInput = {
  tipoDocumento: "CC",
  numeroDocumento: "123",
  nombre: "Juan Pérez",
  correo: null,
  telefono: null,
};

function fila(coeficiente: number, overrides: Partial<FilaImportada> = {}): FilaImportada {
  return {
    bloque: "1",
    apartamento: "101",
    tipo: "apartamento",
    coeficiente,
    propietarios: ["Juan Pérez"],
    ...overrides,
  };
}

describe("validarCopropiedad", () => {
  it("no tiene errores cuando el nombre está presente", () => {
    expect(validarCopropiedad(copropiedadValida)).toEqual([]);
  });

  it("exige el nombre", () => {
    expect(validarCopropiedad({ ...copropiedadValida, nombre: "  " })).toEqual(["El nombre es obligatorio."]);
  });
});

describe("validarUnidad", () => {
  it("no tiene errores con datos válidos", () => {
    expect(validarUnidad(unidadValida)).toEqual([]);
  });

  it("exige el número de la unidad", () => {
    const errores = validarUnidad({ ...unidadValida, identificador: "" });
    expect(errores).toContain("El número de la unidad es obligatorio.");
  });

  it("exige coeficiente mayor a 0", () => {
    const errores = validarUnidad({ ...unidadValida, coeficiente: 0 });
    expect(errores).toContain("El coeficiente debe ser mayor a 0.");
  });
});

describe("validarEdicionLote", () => {
  it("no tiene errores con ids y al menos un cambio válido", () => {
    expect(validarEdicionLote(["a", "b"], { tipo: "parqueadero" })).toEqual([]);
  });

  it("exige al menos una unidad seleccionada", () => {
    const errores = validarEdicionLote([], { tipo: "parqueadero" });
    expect(errores).toContain("No hay unidades seleccionadas.");
  });

  it("exige al menos un campo para actualizar", () => {
    const errores = validarEdicionLote(["a"], {});
    expect(errores).toContain("Selecciona al menos un campo para actualizar.");
  });

  it("exige coeficiente mayor a 0 cuando se incluye", () => {
    const errores = validarEdicionLote(["a"], { coeficiente: 0 });
    expect(errores).toContain("El coeficiente debe ser mayor a 0.");
  });
});

describe("validarPersona", () => {
  it("no tiene errores cuando el nombre está presente", () => {
    expect(validarPersona(personaValida)).toEqual([]);
  });

  it("exige el nombre", () => {
    expect(validarPersona({ ...personaValida, nombre: "" })).toEqual(["El nombre es obligatorio."]);
  });
});

describe("validarPorcentajeParticipacion", () => {
  it("acepta valores entre 0 (exclusivo) y 100", () => {
    expect(validarPorcentajeParticipacion(50)).toEqual([]);
    expect(validarPorcentajeParticipacion(100)).toEqual([]);
  });

  it("rechaza 0 o negativos", () => {
    expect(validarPorcentajeParticipacion(0)).toContain("El % de participación debe ser mayor a 0.");
    expect(validarPorcentajeParticipacion(-5)).toContain("El % de participación debe ser mayor a 0.");
  });

  it("rechaza valores mayores a 100", () => {
    expect(validarPorcentajeParticipacion(101)).toContain("El % de participación no puede ser mayor a 100.");
  });
});

describe("normalizarEscalaCoeficientes", () => {
  it("no convierte cuando la suma cruda ya está en escala fracción (0-1)", () => {
    const filas = [fila(0.5), fila(0.5)];
    const resultado = normalizarEscalaCoeficientes(filas);
    expect(resultado.escalaConvertida).toBe(false);
    expect(resultado.filas.map((f) => f.coeficiente)).toEqual([0.5, 0.5]);
  });

  it("detecta y convierte escala porcentaje (1-100) dividiendo entre 100", () => {
    // Caso real reportado por el usuario: archivo con coeficientes en
    // escala 1-100 que sumaban 100.0 en vez de 1.0.
    const filas = [fila(60), fila(40)];
    const resultado = normalizarEscalaCoeficientes(filas);
    expect(resultado.escalaConvertida).toBe(true);
    expect(resultado.filas.map((f) => f.coeficiente)).toEqual([0.6, 0.4]);
  });

  it("usa el umbral de 10 para decidir la escala (no convierte justo en el límite)", () => {
    const enElLimite = normalizarEscalaCoeficientes([fila(10)]);
    expect(enElLimite.escalaConvertida).toBe(false);

    const pasandoElLimite = normalizarEscalaCoeficientes([fila(10.01)]);
    expect(pasandoElLimite.escalaConvertida).toBe(true);
  });
});

describe("validarFilasImportadas", () => {
  it("es válida cuando la suma de coeficientes da 1.0", () => {
    const resumen = validarFilasImportadas([fila(0.6), fila(0.4)]);
    expect(resumen.esValida).toBe(true);
    expect(resumen.errores).toEqual([]);
    expect(resumen.sumaCoeficientes).toBeCloseTo(1);
  });

  it("acepta un margen pequeño de redondeo (tolerancia 0.01)", () => {
    const resumen = validarFilasImportadas([fila(0.5), fila(0.505)]);
    expect(resumen.esValida).toBe(true);
  });

  it("reporta error cuando la suma no da 1.0 fuera de la tolerancia", () => {
    // Caso real reportado por el usuario: 42 unidades, coeficientes sin
    // normalizar sumando 100.0 en vez de 1.0.
    const resumen = validarFilasImportadas([fila(100)]);
    expect(resumen.esValida).toBe(false);
    expect(resumen.errores.some((e) => e.includes("La suma de coeficientes es"))).toBe(true);
    expect(resumen.diferencia).toBeCloseTo(99);
  });

  it("reporta error cuando el archivo no tiene filas", () => {
    const resumen = validarFilasImportadas([]);
    expect(resumen.esValida).toBe(false);
    expect(resumen.errores).toContain("El archivo no tiene filas de unidades.");
  });

  it("incluye los errores de celda detectados al parsear el Excel", () => {
    const erroresPrevios = ['Fila 3, columna "Tipo": el valor "Bodega" no es válido.'];
    const resumen = validarFilasImportadas([fila(1)], erroresPrevios);
    expect(resumen.errores).toContain(erroresPrevios[0]);
  });

  it("propaga el flag escalaConvertida en el resultado", () => {
    const resumen = validarFilasImportadas([fila(1)], [], true);
    expect(resumen.escalaConvertida).toBe(true);
  });
});
