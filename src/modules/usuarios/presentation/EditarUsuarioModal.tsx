"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Rol } from "@/modules/auth/domain/types";
import { ROLES_SCOPED } from "@/modules/auth/domain/types";
import { listarCopropiedades } from "@/modules/copropiedades/infrastructure/copropiedadRepository";
import type { Copropiedad } from "@/modules/copropiedades/domain/types";
import type { PerfilConRoles, RolAsignado } from "../domain/types";
import { validarNuevoRol } from "../domain/validacion";
import { ROLES_ORDENADOS, ROL_LABEL } from "../domain/etiquetas";
import { agregarRol, quitarRol } from "../infrastructure/usuarioRepository";
import { guardarUsuario } from "../application/guardarUsuario";

const TIPOS_DOCUMENTO = ["CC", "CE", "NIT", "Pasaporte", "TI"];

interface Props {
  perfil: PerfilConRoles;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function EditarUsuarioModal({ perfil, onGuardado, onCancelar }: Props) {
  const [tipoDocumento, setTipoDocumento] = useState(perfil.tipoDocumento ?? TIPOS_DOCUMENTO[0]);
  const [numeroDocumento, setNumeroDocumento] = useState(perfil.numeroDocumento ?? "");
  const [nombre, setNombre] = useState(perfil.nombre);
  const [correo, setCorreo] = useState(perfil.correo ?? "");
  const [telefono, setTelefono] = useState(perfil.telefono ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [roles, setRoles] = useState<RolAsignado[]>(perfil.roles);
  const [nuevoRol, setNuevoRol] = useState<Rol>(ROLES_ORDENADOS[0]);
  const [nuevaCopropiedadId, setNuevaCopropiedadId] = useState("");
  const [copropiedades, setCopropiedades] = useState<Copropiedad[]>([]);
  const [errorRol, setErrorRol] = useState<string | null>(null);
  const [agregandoRol, setAgregandoRol] = useState(false);

  useEffect(() => {
    let activo = true;
    listarCopropiedades().then((datos) => {
      if (activo) setCopropiedades(datos);
    });
    return () => {
      activo = false;
    };
  }, []);

  const esRolScopedSeleccionado = (ROLES_SCOPED as Rol[]).includes(nuevoRol);
  const copropiedadIdParaAgregar = nuevaCopropiedadId || null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await guardarUsuario(perfil.personaId, {
        tipoDocumento: tipoDocumento.trim() ? tipoDocumento : null,
        numeroDocumento: numeroDocumento.trim() ? numeroDocumento.trim() : null,
        nombre,
        correo: correo.trim() ? correo : null,
        telefono: telefono.trim() ? telefono : null,
      });
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  async function onAgregarRol() {
    setErrorRol(null);
    const errores = validarNuevoRol(nuevoRol, copropiedadIdParaAgregar);
    if (errores.length > 0) {
      setErrorRol(errores.join(" "));
      return;
    }
    setAgregandoRol(true);
    try {
      const id = await agregarRol(perfil.perfilId, nuevoRol, copropiedadIdParaAgregar);
      const copropiedadNombre = copropiedadIdParaAgregar
        ? (copropiedades.find((c) => c.id === copropiedadIdParaAgregar)?.nombre ?? null)
        : null;
      setRoles((prev) => [
        ...prev,
        { id, rol: nuevoRol, copropiedadId: copropiedadIdParaAgregar, copropiedadNombre },
      ]);
      setNuevaCopropiedadId("");
      onGuardado();
    } catch (err) {
      setErrorRol(err instanceof Error ? err.message : "No se pudo agregar el rol.");
    } finally {
      setAgregandoRol(false);
    }
  }

  async function onQuitarRol(rolAsignado: RolAsignado) {
    if (!confirm(`¿Quitar el rol "${ROL_LABEL[rolAsignado.rol]}"${rolAsignado.copropiedadNombre ? ` en ${rolAsignado.copropiedadNombre}` : ""}?`)) {
      return;
    }
    await quitarRol(rolAsignado.id);
    setRoles((prev) => prev.filter((r) => r.id !== rolAsignado.id));
    onGuardado();
  }

  return (
    <div className="card card-border bg-white flex flex-col gap-6 max-w-[520px]">
      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.5px] text-teal">Datos personales</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de documento</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Número de documento</label>
            <input
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Nombre</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={guardando} className="btn-cta bg-gold disabled:opacity-60">
            {guardando ? "Guardando..." : "Guardar datos"}
          </button>
          <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
            Cerrar
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3.5 pt-4 border-t border-[#eef2f1]">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.5px] text-teal">Roles</h3>
        {roles.length === 0 && <p className="text-sm text-text-body">Sin roles asignados.</p>}
        {roles.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {roles.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <span>
                  {ROL_LABEL[r.rol]}
                  {r.copropiedadNombre && <span className="text-text-body"> — {r.copropiedadNombre}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => onQuitarRol(r)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-end gap-2 flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1">Agregar rol</label>
            <select
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value as Rol)}
              className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            >
              {ROLES_ORDENADOS.map((r) => (
                <option key={r} value={r}>
                  {ROL_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
          {esRolScopedSeleccionado && (
            <div>
              <label className="block text-sm font-bold mb-1">Copropiedad</label>
              <select
                value={nuevaCopropiedadId}
                onChange={(e) => setNuevaCopropiedadId(e.target.value)}
                className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
              >
                <option value="">Selecciona una copropiedad</option>
                {copropiedades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            disabled={agregandoRol}
            onClick={onAgregarRol}
            className="btn-cta bg-gold text-sm disabled:opacity-60"
          >
            Agregar
          </button>
        </div>
        {errorRol && <p className="text-sm text-red-600">{errorRol}</p>}
      </div>
    </div>
  );
}
