import { describe, expect, it } from "vitest";
import { validarNuevoRol } from "@/modules/usuarios/domain/validacion";

describe("validarNuevoRol", () => {
  it("exige copropiedad para un rol scoped", () => {
    expect(validarNuevoRol("propietario", null)).toEqual(["Selecciona una copropiedad para este rol."]);
  });

  it("acepta un rol scoped con copropiedad", () => {
    expect(validarNuevoRol("consejero", "cop-1")).toEqual([]);
  });

  it("acepta admin_copropiedad con copropiedad", () => {
    expect(validarNuevoRol("admin_copropiedad", "cop-1")).toEqual([]);
  });

  it("rechaza copropiedad en un rol global", () => {
    expect(validarNuevoRol("super_admin", "cop-1")).toEqual(["Los roles globales no llevan copropiedad."]);
  });

  it("acepta un rol global sin copropiedad", () => {
    expect(validarNuevoRol("site_owner", null)).toEqual([]);
  });
});
