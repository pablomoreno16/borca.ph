"use client";

import { useState, type FormEvent } from "react";
import type { Persona } from "../domain/types";
import { buscarPersona, buscarPersonasPorNombre } from "../application/buscarPersona";
import { agregarPropietarioNuevo } from "../application/agregarPropietarioNuevo";
import { agregarPropietarioExistente } from "../application/agregarPropietarioExistente";

const TIPOS_DOCUMENTO = ["CC", "CE", "NIT", "Pasaporte", "TI"];

interface Props {
  modo: "nuevo" | "existente";
  unidadId: string;
  totalActualParticipacion: number;
  onAgregado: () => void;
  onCancelar: () => void;
}

export function AgregarPropietarioModal({ modo, unidadId, totalActualParticipacion, onAgregado, onCancelar }: Props) {
  const [modoBusqueda, setModoBusqueda] = useState<"documento" | "nombre">("nombre");
  const [tipoDocumento, setTipoDocumento] = useState(TIPOS_DOCUMENTO[0]);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [resultadosNombre, setResultadosNombre] = useState<Persona[]>([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // En modo "existente" los campos solo se habilitan tras encontrar a la
  // persona (por documento o por nombre); en "nuevo" están habilitados
  // desde el inicio.
  const camposHabilitados = modo === "nuevo" || personaId !== null;
  const porcentajeNumero = Number(porcentaje) || 0;
  const totalConEste = totalActualParticipacion + porcentajeNumero;

  function limpiarSeleccion() {
    setPersonaId(null);
    setBuscado(false);
    setResultadosNombre([]);
    setNombre("");
    setCorreo("");
    setTelefono("");
  }

  function onCambiarModoBusqueda(nuevoModo: "documento" | "nombre") {
    setModoBusqueda(nuevoModo);
    setError(null);
    limpiarSeleccion();
  }

  function seleccionarPersona(persona: Persona) {
    setPersonaId(persona.id);
    setNombre(persona.nombre);
    setCorreo(persona.correo ?? "");
    setTelefono(persona.telefono ?? "");
    // La búsqueda por nombre no usa tipo/número de documento como criterio
    // (por eso existe: el documento puede estar vacío), así que hay que
    // reflejar aquí lo que la persona ya tenga para no pisarlo al guardar.
    setTipoDocumento(persona.tipoDocumento ?? TIPOS_DOCUMENTO[0]);
    setNumeroDocumento(persona.numeroDocumento ?? "");
    setResultadosNombre([]);
  }

  async function onConsultarDocumento() {
    if (!numeroDocumento.trim()) return;
    setError(null);
    setConsultando(true);
    try {
      const persona = await buscarPersona(tipoDocumento, numeroDocumento.trim());
      setBuscado(true);
      if (persona) seleccionarPersona(persona);
      else {
        setPersonaId(null);
        setNombre("");
        setCorreo("");
        setTelefono("");
      }
    } catch {
      setError("No se pudo consultar el documento.");
    } finally {
      setConsultando(false);
    }
  }

  async function onBuscarPorNombre() {
    if (!nombreBusqueda.trim()) return;
    setError(null);
    setPersonaId(null);
    setConsultando(true);
    try {
      const resultados = await buscarPersonasPorNombre(nombreBusqueda.trim());
      setBuscado(true);
      setResultadosNombre(resultados);
      if (resultados.length === 1) seleccionarPersona(resultados[0]);
    } catch {
      setError("No se pudo buscar por nombre.");
    } finally {
      setConsultando(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const datosPersona = {
        tipoDocumento: modo === "existente" ? tipoDocumento : tipoDocumento.trim() ? tipoDocumento : null,
        numeroDocumento: numeroDocumento.trim() ? numeroDocumento.trim() : null,
        nombre,
        correo: correo.trim() ? correo : null,
        telefono: telefono.trim() ? telefono : null,
      };
      if (modo === "nuevo") {
        await agregarPropietarioNuevo(unidadId, datosPersona, porcentajeNumero);
      } else {
        if (!personaId) throw new Error("Busca un propietario existente antes de guardar.");
        await agregarPropietarioExistente(unidadId, personaId, datosPersona, porcentajeNumero);
      }
      onAgregado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el propietario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      <h3 className="font-bold">{modo === "nuevo" ? "Nuevo propietario" : "Agregar propietario existente"}</h3>

      {modo === "existente" && (
        <>
          <div className="flex gap-3 text-sm font-semibold">
            <button
              type="button"
              onClick={() => onCambiarModoBusqueda("nombre")}
              className={modoBusqueda === "nombre" ? "text-teal underline" : "text-text-body hover:underline"}
            >
              Buscar por nombre
            </button>
            <button
              type="button"
              onClick={() => onCambiarModoBusqueda("documento")}
              className={modoBusqueda === "documento" ? "text-teal underline" : "text-text-body hover:underline"}
            >
              Buscar por documento
            </button>
          </div>

          {modoBusqueda === "documento" ? (
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-sm font-bold mb-1">Tipo de documento</label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Número de documento</label>
                <input
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
                />
              </div>
              <button
                type="button"
                onClick={onConsultarDocumento}
                disabled={consultando || !numeroDocumento.trim()}
                className="btn-cta bg-gold disabled:opacity-60"
              >
                {consultando ? "Consultando..." : "Consultar"}
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Nombre</label>
                <input
                  autoFocus
                  value={nombreBusqueda}
                  onChange={(e) => setNombreBusqueda(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
                />
              </div>
              <button
                type="button"
                onClick={onBuscarPorNombre}
                disabled={consultando || !nombreBusqueda.trim()}
                className="btn-cta bg-gold disabled:opacity-60"
              >
                {consultando ? "Buscando..." : "Buscar"}
              </button>
            </div>
          )}

          {buscado && !personaId && resultadosNombre.length === 0 && (
            <p className="text-sm text-red-600">
              {modoBusqueda === "documento"
                ? "No se encontró ningún propietario con ese documento."
                : "No se encontraron propietarios con ese nombre."}
            </p>
          )}

          {resultadosNombre.length > 1 && (
            <div className="rounded-[8px] border border-[#e5e9e8] flex flex-col divide-y divide-[#eef2f1] max-h-[180px] overflow-y-auto">
              {resultadosNombre.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => seleccionarPersona(p)}
                  className="text-left px-3 py-2 text-sm hover:bg-[#f4f7f6]"
                >
                  <span className="font-semibold">{p.nombre}</span>
                  {p.tipoDocumento && p.numeroDocumento && (
                    <span className="text-text-body">
                      {" "}
                      — {p.tipoDocumento} {p.numeroDocumento}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {personaId && <p className="text-sm text-teal font-semibold">Propietario seleccionado.</p>}
        </>
      )}

      {/* En modo "nuevo" y en "existente" buscando por nombre estos campos no
          se muestran en ningún otro lado (a diferencia de la búsqueda por
          documento, donde ya sirven como criterio de búsqueda arriba). */}
      {(modo === "nuevo" || (modo === "existente" && modoBusqueda === "nombre")) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de documento</label>
            <select
              value={tipoDocumento}
              disabled={!camposHabilitados}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
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
              disabled={!camposHabilitados}
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1">Nombre</label>
        <input
          required
          disabled={!camposHabilitados}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Correo</label>
          <input
            type="email"
            disabled={!camposHabilitados}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Teléfono</label>
          <input
            disabled={!camposHabilitados}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">% de participación</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          max="100"
          disabled={!camposHabilitados}
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
        />
      </div>
      <p className="text-sm text-text-body">
        % de participación total de la unidad: <strong>{totalConEste.toFixed(2)}%</strong>
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando || !camposHabilitados}
          className="btn-cta bg-gold disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
